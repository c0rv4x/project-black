from sqlalchemy import desc, or_, and_
from sqlalchemy.orm import aliased, contains_eager
from sqlalchemy.sql.expression import func

from black.db import IPDatabase, ScanDatabase, FileDatabase
from managers.scopes.filters import Filters


class SubqueryBuilder:
    @staticmethod
    def ips_basic_filtered(session, project_uuid, ip_filters):
        ips_query = (
            session.query(
                IPDatabase
            )
            .filter(
                IPDatabase.project_uuid == project_uuid,
                ip_filters
            )
        )

        return ips_query

    @staticmethod
    def scans_basic_filtered(session, project_uuid, filters):
        # Create a list of filters which will be applied against scans
        scans_filters = Filters.build_scans_filters(
            filters, ScanDatabase
        )

        scans_selected = (
            session.query(
                ScanDatabase
            ).filter(
                ScanDatabase.project_uuid == project_uuid,
                scans_filters
            ).subquery()
        )

        return scans_selected

    @staticmethod
    def files_basic_filtered(session, project_uuid, filters):
        """ Creates a query for selection unique,
        ordered and filtered files """
        files_filters = Filters.build_files_filters(
            filters, FileDatabase, project_uuid=project_uuid)

        subquery = (
            session.query(
                FileDatabase
            )
            .filter(FileDatabase.project_uuid == project_uuid)
            .filter(files_filters)
            .subquery('project_files_ordered')
        )

        return subquery

    @staticmethod
    def page_ids(query, orm_object, page_number, page_size):
        if page_number is None or page_size is None:
            subquery = (
                query
                .from_self(orm_object.id, orm_object.target)
                .distinct()
                .order_by(orm_object.target)
                .from_self(orm_object.id)
                .subquery('paginated_hosts_ids')
            )
        else:
            subquery = (
                query
                .from_self(orm_object.id, orm_object.target)
                .distinct()
                .order_by(orm_object.target)
                .limit(page_size)
                .offset(page_size * page_number)
                .from_self(orm_object.id)
                .subquery('paginated_hosts_ids')
            )

        return subquery
