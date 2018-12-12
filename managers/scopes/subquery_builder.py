from sqlalchemy import desc, or_, and_
from sqlalchemy.orm import aliased, contains_eager
from sqlalchemy.sql.expression import func

from black.db import ScanDatabase, FileDatabase
from managers.scopes.filters import Filters


class SubqueryBuilder:
    @staticmethod
    def build_scans_subquery(session, project_uuid, filters):
        # Create a list of filters which will be applied against scans
        scans_filters = Filters.build_scans_filters(
            filters, ScanDatabase
        )

        r = (
            session.query(
                ScanDatabase,
                func.rank().over(
                    partition_by=[ScanDatabase.target, ScanDatabase.port_number],
                    order_by=ScanDatabase.date_added
                ).label('date_rank')
            ).filter(
                ScanDatabase.project_uuid == project_uuid,
                scans_filters
            ).subquery()
        )

        scans_from_db = (
            session.query(
                ScanDatabase
            ).select_entity_from(
                r
            ).filter(
                r.c.date_rank == 1
            )
        ).subquery('ports_latest')

        # scans_from_db = (
        #     session.query(
        #         ScanDatabase
        #     )
        #     .filter(
        #         ScanDatabase.project_uuid == project_uuid,
        #         scans_filters
        #     )
        #     .join(
        #         ports,
        #         and_(
        #             ScanDatabase.date_added == ports.c.latesttime,
        #             ScanDatabase.target == ports.c.target,
        #             ScanDatabase.port_number == ports.c.port_number
        #         )
        #     )
        #     .subquery("ports_latest")
        # )

        return scans_from_db

    @staticmethod
    def build_files_subquery(session, project_uuid, filters):
        """ Creates a query for selection unique,
        ordered and filtered files """

        # Select distinc files, let's select unique tuples
        #   (file_path, status_code, content_length)
        subq = (
            session.query(
                FileDatabase
            )
            .filter(FileDatabase.project_uuid == project_uuid)
            # .order_by(desc(FileDatabase.date_added))
            .subquery('project_files_ordered')
        )
        alias_ordered = aliased(FileDatabase, subq)
        ordered = session.query(alias_ordered)

        # Create a list of filters which will be applied against scans
        files_filters = Filters.build_files_filters(
            filters, alias_ordered, project_uuid=project_uuid)

        # files_ordered_distinct = ordered.distinct(
        #     alias_ordered.file_path,
        #     alias_ordered.status_code,
        #     alias_ordered.content_length)

        # Use filters
        files_from_db = (
            ordered
            .filter(files_filters)
            .subquery('files_distinct_filtered')
        )

        return files_from_db
