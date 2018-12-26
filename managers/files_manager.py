from black.db import Sessions, FileDatabase


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.sessions = Sessions()

    def count(self, project_uuid=None):
        return FileDatabase.count(project_uuid)

    def get_stats_ips(self, project_uuid, ip_ids, filters):
        return FileDatabase.get_stats_for_ips(project_uuid, ip_ids, filters)

    def get_stats_hosts(self, project_uuid, host_ids, filters):
        return FileDatabase.get_stats_for_hosts(project_uuid, host_ids, filters)

    def get_files_hosts(self, host_id, port_number, limit, offset, filters):
        try:
            files = []

            with self.sessions.get_session() as session:
                prepared_filters = [
                    FileDatabase.host_id == host_id,
                    FileDatabase.port_number == port_number
                ]

                if filters and filters[0] != '%':
                    prepared_filters.append(FileDatabase.status_code.in_(filters))

                files = (
                    session.query(
                        FileDatabase,
                    )
                    .filter(
                        *prepared_filters
                    )
                    .order_by(FileDatabase.status_code, FileDatabase.file_name)
                    .limit(limit)
                    .offset(offset)
                    .all()
                )

            return {"status": "success", "files": files}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    def get_files_ips(self, ip, port_number, limit, offset, filters):
        try:
            files = []

            with self.sessions.get_session() as session:
                prepared_filters = [
                    FileDatabase.ip_id == ip,
                    FileDatabase.port_number == port_number
                ]

                if filters and filters[0] != '%':
                    prepared_filters.append(FileDatabase.status_code.in_(filters))

                files = (
                    session.query(
                        FileDatabase,
                    )
                    .filter(
                        *prepared_filters
                    )
                    .order_by(FileDatabase.status_code, FileDatabase.file_name)
                    .limit(limit)
                    .offset(offset)
                    .all()
                )
            return {"status": "success", "files": files}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
