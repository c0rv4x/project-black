import datetime
from functools import reduce
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy import func

from .base import Base
from black.db.sessions import Sessions


class FileDatabase(Base):
    """ Keeps data on the found file """
    __tablename__ = "files"
    __table_args__ = (
        UniqueConstraint('file_path', 'status_code', 'content_length', 'project_uuid'),
    )

    # Primary key
    file_id = Column(String, primary_key=True)

    # Name of the file
    file_name = Column(String)

    host_id = Column(Integer, ForeignKey('hosts.id'), index=True)

    ip_id = Column(Integer, ForeignKey('ips.id'), index=True)

    # Port
    port_number = Column(Integer)

    # File path
    file_path = Column(String)

    # Status code of that file
    status_code = Column(Integer)

    # Content length of that response
    content_length = Column(String)

    # Special note (for now, we will keep only redirects)
    special_note = Column(String)

    # ID of the related task (the task, which resulted in the current data)
    task_id = Column(String, ForeignKey('tasks.task_id'))

    # The name of the related project
    project_uuid = Column(
        Integer, ForeignKey('projects.project_uuid', ondelete='CASCADE'), index=True
    )

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    session_spawner = Sessions()

    @classmethod
    def count(cls, project_uuid):
        with cls.session_spawner.get_session() as session:
            try:
                amount = cls._query_by_project_uuid(session, project_uuid).count()
            except Exception as exc:
                return {
                    "status": "error",
                    "text": str(exc)
                }

        return {
            "status": "success", 
            "amount": amount
        }

    @classmethod
    def _query_by_project_uuid(cls, session, project_uuid):
        return (
            session.query(
                cls
            )
            .filter(
                cls.project_uuid == project_uuid if project_uuid is not None else True
            )
        )

    @classmethod
    def get_stats_for_ips(cls, project_uuid, ip_ids, filters):
        stats = {}

        try:
            with cls.session_spawner.get_session() as session:
                status_code_filters = []
                if filters and filters[0] != '%':
                    status_code_filters.append(FileDatabase.status_code.in_(filters))

                for ip_id in ip_ids:
                    prepared_filters = [FileDatabase.ip_id == ip_id] + status_code_filters  
                    files_stats = (
                        session.query(
                            FileDatabase.status_code,
                            FileDatabase.port_number,
                            func.count(FileDatabase.status_code)
                        )
                        .filter(*prepared_filters)
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

    @classmethod
    def get_stats_for_hosts(cls, project_uuid, host_ids, filters):
        stats = {}

        try:
            with cls.session_spawner.get_session() as session:
                status_code_filters = []
                if filters and filters[0] != '%':
                    status_code_filters.append(FileDatabase.status_code.in_(filters))

                for host_id in host_ids:
                    prepared_filters = [FileDatabase.host_id == host_id] + status_code_filters 

                    files_stats = (
                        session.query(
                            FileDatabase.status_code,
                            FileDatabase.port_number,
                            func.count(FileDatabase.status_code)
                        )
                        .filter(*prepared_filters)
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

    @classmethod
    def get_files_ip(cls, ip, port_number, limit, offset, filters):
        try:
            files = []

            with cls.session_spawner.get_session() as session:
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
            print(exc)
            return {"status": "error", "text": str(exc)}

    @classmethod
    def get_files_host(cls, host_id, port_number, limit, offset, filters):
        try:
            files = []

            with cls.session_spawner.get_session() as session:
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


    def dict(self):
        return {
            "file_id": self.file_id,
            "host_id": self.host_id,
            "ip_id": self.ip_id,
            "file_name": self.file_name,
            "port_number": self.port_number,
            "file_path": self.file_path,
            "status_code": self.status_code,
            "content_length": self.content_length,
            "special_note": self.special_note,
            "task_id": self.task_id,
            "project_uuid": self.project_uuid
        }

    def __repr__(self):
        return """
            <FileDatabase(file_id='%s', project_uuid='%s', file_name='%s')>""" % (
            self.file_id, self.project_uuid,
            self.file_name
        )
