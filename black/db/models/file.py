import datetime
from .base import Base
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer


class FileDatabase(Base):
    """ Keeps data on the found file """
    __tablename__ = "files"

    # Primary key
    file_id = Column(String, primary_key=True)

    # Name of the file
    file_name = Column(String)

    # Target (this is either IP or hostname)
    target = Column(String)

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
        String, ForeignKey('projects.project_uuid', ondelete='CASCADE')
    )

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow)
