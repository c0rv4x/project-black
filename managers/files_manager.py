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
                            func.count(FileDatabase.status_code)
                        )
                        .filter(FileDatabase.ip_id == ip_id)
                        .group_by(FileDatabase.status_code)
                        .all()
                    )

                    stats[ip_id] = dict(files_stats)
                    
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
                            func.count(FileDatabase.status_code)
                        )
                        .filter(FileDatabase.host_id == host_id)
                        .group_by(FileDatabase.status_code)
                        .all()
                    )

                    stats[host_id] = dict(files_stats)
                    
            return {"status": "success", "stats": stats}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    def get_files_hosts(self, host_id, port_number, limit, offset):
        try:
            files = []

            with self.sessions.get_session() as session:
                files = (
                    session.query(
                        FileDatabase,
                    )
                    .filter(
                        FileDatabase.host_id == host_id,
                        FileDatabase.port_number == port_number
                    )
                    .order_by(FileDatabase.status_code, FileDatabase.file_name)
                    .limit(limit)
                    .offset(offset)
                    .all()
                )

            return {"status": "success", "files": files}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    def get_files_ips(self, ip, port_number, limit, offset):
        try:
            files = []

            with self.sessions.get_session() as session:
                print("Starting {}, {}".format(ip, port_number))
                files = (
                    session.query(
                        FileDatabase,
                    )
                    .filter(
                        FileDatabase.ip_id == ip,
                        FileDatabase.port_number == port_number
                    )
                    .order_by(FileDatabase.status_code, FileDatabase.file_name)
                    .limit(limit)
                    .offset(offset)
                    .all()
                )
                print(files)
            return {"status": "success", "files": files}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
