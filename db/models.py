""" Models for SQLAlchemy ORM """
import uuid
import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from managers.scopes.host import HostInternal
from managers.scopes.ip import IP_addr


class IP_addr(Base):
    """ Kepps the data on scope:
    * Hostnames
    * IPs
    * Related data (like, 'scope_id' and the project name)  """
    __abstract__ = True

    # Primary key (probably uuid4)
    ip_id = Column(String, primary_key=True)

    # IP address is a string (probably None, but not sure if
    #    is needed)
    ip_address = Column(String)

    # Comment field, as requested by VI
    comment = Column(String, default="")

    # The name of the related project
    @declared_attr
    def project_uuid(cls):
        return Column(
            String, ForeignKey('projects.project_uuid', ondelete="CASCADE")
        )

    # References the task that got this record
    # Default is None, as scope can be given by the user manually.
    @declared_attr
    def task_id(cls):
        return Column(
            String,
            ForeignKey('tasks.task_id', ondelete='SET NULL'),
            default=None
        )

    # Date of adding
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return """<IP_addr(ip_id='%s', hostname='%s',
                        ip_address='%s', project_uuid='%s')>""" % (
            self.ip_id, self.hostnames, self.ip_address, self.project_uuid
        )
