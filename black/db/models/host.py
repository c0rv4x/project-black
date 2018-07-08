import datetime
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from .scope import Scope, association_table


class HostDatabase(Scope):
    """ Keeps hosts that point to relative IPs """
    __tablename__ = 'hosts'

    # Primary key (probably uuid4)
    id = Column(Integer, primary_key=True, autoincrement=True)

    # IP address is a string (probably None, but not sure if
    #    is needed)
    target = Column(String)

    # Comment field, as requested by VI
    comment = Column(String, default="")

    # A list of files which is associated with the current scope
    files = relationship('FileDatabase', cascade="all, delete-orphan", lazy='select', primaryjoin="HostDatabase.target == foreign(FileDatabase.target)")

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

    def dict(self, include_ports=False, include_ips=False, include_files=False):
        return {
            "host_id": self.id,
            "hostname": self.target,
            "comment": self.comment,
            "project_uuid": self.project_uuid,
            "task_id": self.task_id,
            "ip_addresses": list(map(
                lambda hostname: hostname.dict(include_ports=include_ports), self.ip_addresses
            )) if include_ips else [],
            "files": list(map(lambda file: file.dict(), self.files)) if include_files else []
        }

    def __repr__(self):
        return """<HostDatabase(host_id='%s', hostname='%s',
                        ip_addresses='%s', project_uuid='%s')>""" % (
            self.id, self.target, self.ip_addresses, self.project_uuid
        )
