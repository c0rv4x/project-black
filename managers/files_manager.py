from functools import reduce
from sqlalchemy import func

from black.db import Sessions, FileDatabase


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.sessions = Sessions()

    def count(self, project_uuid=None):
        assert project_uuid is not None

        session = self.sessions.get_new_session()
        amount = (
            session.query(
                FileDatabase
            )
            .filter(
                FileDatabase.project_uuid == project_uuid
            )
            .count()
        )
        self.sessions.destroy_session(session)

        return amount

    def get_stats_ips(self, project_uuid, ip_ids):
        stats = {}

        try:
            with self.sessions.get_session() as session:
                for ip_id in ip_ids:
                    files_stats = (
                        session.query(
                            FileDatabase.status_code,
                            FileDatabase.port_number,
                            func.count(FileDatabase.status_code)
                        )
                        .filter(FileDatabase.ip_id == ip_id)
                        .group_by(
                            FileDatabase.status_code,
                            FileDatabase.port_number
                        )
                        .all()
                    )

                    stats[ip_id] = {}
                    for status_code, port_number, res in files_stats:
                        if port_number not in stats[ip_id]:
                            stats[ip_id][port_number] = {}
                        stats[ip_id][port_number][status_code] = res

                    for port_number, stats_for_port in stats[ip_id].items():
                        stats[ip_id][port_number]['total'] = reduce(
                            lambda x, y: x + y,
                            map(lambda stat: stat[1], stats_for_port.items())
                        )

            return {"status": "success", "stats": stats}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    def get_stats_hosts(self, project_uuid, host_ids):
        stats = {}

        try:
            with self.sessions.get_session() as session:
                for host_id in host_ids:
                    files_stats = (
                        session.query(
                            FileDatabase.status_code,
                            FileDatabase.port_number,
                            func.count(FileDatabase.status_code)
                        )
                        .filter(FileDatabase.host_id == host_id)
                        .group_by(
                            FileDatabase.status_code,
                            FileDatabase.port_number
                        )
                        .all()
                    )

                    stats[host_id] = {}
                    for status_code, port_number, res in files_stats:
                        if port_number not in stats[host_id]:
                            stats[host_id][port_number] = {}
                        stats[host_id][port_number][status_code] = res

                    for port_number, stats_for_port in stats[host_id].items():
                        stats[host_id][port_number]['total'] = reduce(
                            lambda x, y: x + y,
                            map(lambda stat: stat[1], stats_for_port.items())
                        )

            return {"status": "success", "stats": stats}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

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
