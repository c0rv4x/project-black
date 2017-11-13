import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from .base import Base


class ProjectDatabase(Base):
    """ Kepps the names of all the projects that exist
    in the system. This is somewhat abstract, as it has no relations.
    They are added at a higher level of abstraction """
    __tablename__ = 'projects'

    # ID of the project (uuid for now)
    project_uuid = Column(String, primary_key=True)

    # Given name
    project_name = Column(String)

    # Really crucial comment field
    comment = Column(String)

    # Just Date
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    # Some relationships
    ips_relationship = relationship('IPDatabase', cascade="all, delete-orphan")
    hosts_relationship = relationship('HostDatabase', cascade="all, delete-orphan")
    tasks_relationship = relationship('TaskDatabase', cascade="all, delete-orphan")
    # scans_relationship = relationship('Scan', cascade="all, delete-orphan")

    def __repr__(self):
        return "<Project(project_name='%s')>" % (self.project_name)
