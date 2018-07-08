import datetime
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship, joinedload

from .scope import Scope, association_table
from black.db.sessions import Sessions


class IPDatabase(Scope):
    """ Kepps the data on scope:
    * Hostnames
    * IPs
    * Related data (like, 'scope_id' and the project name)  """
    __tablename__ = 'ips'

    # Primary key (probably uuid4)
    id = Column(Integer, primary_key=True, autoincrement=True)

    # IP address is a string (probably None, but not sure if
    #    is needed)
    target = Column(String)

    # Comment field, as requested by VI
    comment = Column(String, default="")

    # A list of files which is associated with the current scope
    files = relationship('FileDatabase', cascade="all, delete-orphan", lazy='select', primaryjoin="IPDatabase.target == foreign(FileDatabase.target)")

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

    # The hostnames that point to this IP
    hostnames = relationship(
        "HostDatabase",
        secondary=association_table,
        back_populates="ip_addresses",
        lazy="noload"
    )

    # Open ports
    ports = relationship('ScanDatabase', cascade="all, delete-orphan", lazy='select')

    __mapper_args__ = {
        'concrete': True
    }

    session_spawner = Sessions()

    def dict(self, include_ports=False, include_hostnames=False, include_files=False):
        return {
            "ip_id": self.id,
            "ip_address": self.target,
            "comment": self.comment,
            "project_uuid": self.project_uuid,
            "task_id": self.task_id,
            "scans": list(map(lambda port: port.dict(), self.ports)) if include_ports else [],
            "hostnames": list(map(lambda hostname: hostname.dict(), self.hostnames)) if include_hostnames else [],
            "files": list(map(lambda file: file.dict(), self.files)) if include_files else []
        }

    @classmethod
    def delete_scope(cls, scope_id):
        """ Deletes scope by its id """

        try:
            with cls.session_spawner.get_session() as session:
                db_object = (
                    session.query(
                        IPDatabase
                    )
                    .filter(IPDatabase.id == scope_id)
                    .options(joinedload(IPDatabase.hostnames))
                    .one()
                )

                target = db_object.target

                # for host in db_object.hostnames:
                #     host.ip_addresses.remove(db_object)
                    # session.add(host)

                session.delete(db_object)
        except Exception as exc:
            print(str(exc))
            return {"status": "error", "text": str(exc), "target": scope_id}
        else:
            return {"status": "success", "target": target}    

    def __repr__(self):
        return """
        <IPDatabase(ip_id='%s', hostnames='%s', ip_address='%s', project_uuid='%s', files='%s')>""" % (
            self.id, self.hostnames, self.target, self.project_uuid,
            self.files
        )
