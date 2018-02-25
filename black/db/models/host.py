import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from .scope import Scope, association_table


class HostDatabase(Scope):
    """ Keeps hosts that point to relative IPs """
    __tablename__ = 'hosts'

    # Primary key (probably uuid4)
    id = Column(String, primary_key=True)

    # IP address is a string (probably None, but not sure if
    #    is needed)
    target = Column(String)

    # Comment field, as requested by VI
    comment = Column(String)

    # A list of files which is associated with the current scope
    files = relationship('FileDatabase', cascade="all, delete-orphan", lazy='select', primaryjoin="HostDatabase.target == foreign(FileDatabase.target)")

    # The name of the related project
    project_uuid = Column(
        Integer, ForeignKey('projects.project_uuid', ondelete="CASCADE")
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

    def __repr__(self):
        return """<HostDatabase(host_id='%s', hostname='%s',
                        ip_addresses='%s', project_uuid='%s')>""" % (
            self.id, self.target, self.ip_addresses, self.project_uuid
        )
