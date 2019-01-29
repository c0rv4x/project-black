import asyncio
import datetime
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship, joinedload

from .base import Base, association_table, asyncify
from black.db.sessions import Sessions


class HostDatabase(Base):
    """ Keeps hosts that point to relative IPs """
    __tablename__ = 'hosts'
    __table_args__ = (
        UniqueConstraint('target', 'project_uuid'),
    )

    # Primary key (probably uuid4)
    id = Column(Integer, primary_key=True, autoincrement=True)

    # IP address is a string (probably None, but not sure if
    #    is needed)
    target = Column(String)

    # Comment field, as requested by VI
    comment = Column(String, default="")

    # A list of files which is associated with the current scope
    files = relationship('FileDatabase', cascade="all, delete-orphan", lazy='select')

    # The name of the related project
    project_uuid = Column(
        Integer, ForeignKey('projects.project_uuid', ondelete="CASCADE"), index=True
    )

    # References the task that got this record
    # Default is None, as scope can be given by the user manually.
    task_id = Column(
        String, ForeignKey('tasks.task_id', ondelete='SET NULL'), default=None
    )

    # Date of adding
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    # IP addresses of that host
    ip_addresses = relationship(
        "IPDatabase",
        secondary=association_table,
        back_populates="hostnames",
        lazy='noload'
    )

    __mapper_args__ = {
        'concrete': True
    }

    session_spawner = Sessions()

    @classmethod
    def _find(cls, target, project_uuid):
        """ Finds scope (host or ip) in the database """

        with cls.session_spawner.get_session() as session:
            scope_from_db = session.query(cls).filter(
                cls.project_uuid == project_uuid,
                cls.target == target
            ).one_or_none()

            return scope_from_db        

    @classmethod
    async def find(cls, *args, **kwargs):
        return await asyncio.get_event_loop().run_in_executor(None, lambda: cls._find(*args, **kwargs))

    @classmethod
    @asyncify
    def create(cls, target, project_uuid, task_id=None):
        """ Creates a new scope if it is not in the db yet """

        if cls._find(target, project_uuid) is None:
            try:
                new_scope = cls(
                    target=target,
                    project_uuid=project_uuid,
                    task_id=task_id
                )

                with cls.session_spawner.get_session() as session:
                    session.add(new_scope)
            except Exception as exc:
                return {"status": "error", "text": str(exc)}
            else:
                return {
                    "status": "success",
                    "new_scope": new_scope
                }

        return {"status": "duplicate", "text": "duplicate"}

    @classmethod
    @asyncify
    def get_or_create(cls, target, project_uuid, task_id=None):
        """ Returns a tuple (new_scope, created).
        Second value:
            False if existed
            True if created
        """
        found = cls._find(target, project_uuid)

        if found is None:
            try:
                new_scope = cls(
                    target=target,
                    project_uuid=project_uuid,
                    task_id=task_id
                )

                with cls.session_spawner.get_session() as session:
                    session.add(new_scope)
            except Exception as exc:
                return (None, None)
            else:
                return (new_scope, True)
        return (found, False)

    @classmethod
    @asyncify
    def update(cls, scope_id, comment):
        try:
            with cls.session_spawner.get_session() as session:
                db_object = session.query(cls).filter(
                    cls.id == scope_id
                ).one()
                target = db_object.target
                db_object.comment = comment
                session.add(db_object)
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
        else:
            return {"status": "success", "target": target}

    @classmethod
    def count(cls, project_uuid):
        with cls.session_spawner.get_session() as session:
            return session.query(cls).filter(
                cls.project_uuid == project_uuid
            ).count()

    @classmethod
    @asyncify
    def delete_scope(cls, scope_id):
        """ Deletes scope by its id """

        try:
            with cls.session_spawner.get_session() as session:
                db_object = (
                    session.query(
                        HostDatabase
                    )
                    .filter(HostDatabase.id == scope_id)
                    .options(joinedload(HostDatabase.ip_addresses))
                    .one()
                )

                target = db_object.target

                session.delete(db_object)
        except Exception as exc:
            print(str(exc))
            return {"status": "error", "text": str(exc), "target": scope_id}
        else:
            return {"status": "success", "target": target}

    def dict(self, include_ports=False, include_ips=False, include_files=False, files_statsified=False):
        return {
            "host_id": self.id,
            "hostname": self.target,
            "comment": self.comment,
            "project_uuid": self.project_uuid,
            "task_id": self.task_id,
            "ip_addresses": list(map(
                lambda hostname: hostname.dict(include_ports=include_ports), self.ip_addresses
            )) if include_ips else [],
            "files": []
        }

    def __repr__(self):
        return """<HostDatabase(host_id='%s', hostname='%s',
                        ip_addresses='%s', project_uuid='%s')>""" % (
            self.id, self.target, self.ip_addresses, self.project_uuid
        )
