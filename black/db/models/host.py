import datetime
from black.black.db.models.base import Base
from sqlalchemy import Column, String, DateTime, ForeignKey


class HostDatabase(Base):
    """ Keeps hosts that point to relative IPs """
    __tablename__ = "hosts"

    # Primary key (probably uuid4)
    host_id = Column(String, primary_key=True)

    # Hostname (dns record-like)
    hostname = Column(String)

    # Some text comment
    comment = Column(String)

    # The name of the related project
    project_uuid = Column(
        String, ForeignKey('projects.project_uuid', ondelete="CASCADE")
    )

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    # References the task that got this record
    # Default is None, as scope can be given by the user manually.
    task_id = Column(
        String, ForeignKey('tasks.task_id', ondelete='SET NULL'), default=None
    )
