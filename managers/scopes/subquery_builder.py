from sqlalchemy import desc
from sqlalchemy.orm import aliased, contains_eager

from black.black.db import ScanDatabase, FileDatabase
from managers.scopes.filters import Filters


class SubqueryBuilder:
    @staticmethod
    def build_scans_subquery(session, project_uuid, parsed_filters):
        # Create a query for selection unique, ordered and filtered scans

        # Select distinc scans (we need only the latest)
        subq = (
            session.query(
                ScanDatabase
            )
            .filter(ScanDatabase.project_uuid == project_uuid)
            .order_by(desc(ScanDatabase.date_added))
            .subquery('project_scans_ordered')
        )
        alias_ordered = aliased(ScanDatabase, subq)
        ordered = session.query(alias_ordered)

        # Create a list of filters which will be applied against scans
        scans_filters = Filters.build_scans_filters(
            parsed_filters, alias_ordered)

        scans_ordered_distinct = ordered.distinct(
            alias_ordered.target, alias_ordered.port_number)

        # Use filters
        scans_from_db = (
            scans_ordered_distinct
            .filter(*scans_filters)
            .subquery('scans_distinct_filtered')
        )

        return scans_from_db

    @staticmethod
    def build_files_subquery(session, project_uuid, parsed_filters):
        """ Creates a query for selection unique,
        ordered and filtered files """

        # Select distinc files, let's select unique tuples
        #   (file_path, status_code, content_length)
        subq = (
            session.query(
                FileDatabase
            )
            .filter(FileDatabase.project_uuid == project_uuid)
            .order_by(desc(FileDatabase.date_added))
            .subquery('project_files_ordered')
        )
        alias_ordered = aliased(FileDatabase, subq)
        ordered = session.query(alias_ordered)

        # Create a list of filters which will be applied against scans
        files_filters = Filters.build_files_filters(
            parsed_filters, alias_ordered)

        files_ordered_distinct = ordered.distinct(
            alias_ordered.file_path,
            alias_ordered.status_code,
            alias_ordered.content_length)

        # Use filters
        files_from_db = (
            files_ordered_distinct
            .filter(*files_filters)
            .subquery('files_distinct_filtered')
        )

        return files_from_db
