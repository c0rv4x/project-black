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
    target = Column(String, index=True)

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


    def dict(self):
        return {
            "file_id": self.file_id,
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
            <FileDatabase(file_id='%s', target='%s', project_uuid='%s', file_name='%s')>""" % (
            self.file_id, self.target, self.project_uuid,
            self.file_name
        )
