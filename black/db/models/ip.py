import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from .scope import Scope, association_table


class IPDatabase(Scope):
    """ Kepps the data on scope:
    * Hostnames
    * IPs
    * Related data (like, 'scope_id' and the project name)  """
    __tablename__ = 'ips'

    # Primary key (probably uuid4)
    id = Column(String, primary_key=True)

    # IP address is a string (probably None, but not sure if
    #    is needed)
    target = Column(String)

    # Comment field, as requested by VI
    comment = Column(String)

    # A list of files which is associated with the current scope
    files = relationship('FileDatabase', cascade="all, delete-orphan", lazy='select', primaryjoin="IPDatabase.target == foreign(FileDatabase.target)")

    # The name of the related project
    project_uuid = Column(
        String, ForeignKey('projects.project_uuid', ondelete="CASCADE")
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
        lazy='noload'
    )

    # Open ports
    ports = relationship('ScanDatabase', cascade="all, delete-orphan", lazy='select')

    __mapper_args__ = {
        'concrete': True
    }

    def __repr__(self):
        return """
        <IPDatabase(ip_id='%s', hostnames='%s', ip_address='%s', project_uuid='%s', files='%s')>""" % (
            self.id, self.hostnames, self.target, self.project_uuid,
            self.files
        )
