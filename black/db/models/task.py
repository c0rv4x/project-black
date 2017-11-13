import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer

from .base import Base


class TaskDatabase(Base):
    """ Keeps the data of all the tasks that ever existed
    in the system (though not the deleted ones) """
    __tablename__ = 'tasks'

    # Primary key (uuid4)
    task_id = Column(String, primary_key=True)

    # Literal name of the task: dnsscan, nmap etc.
    task_type = Column(String)

    # Target can be: hostname, ip, URL
    #    (depending on the task_type)
    target = Column(String)

    # Params of the lanuched task (flags, dictionaries etc.)
    params = Column(String)

    # {New, Working, Finished, Aborted, ...}
    status = Column(String)

    # Progress in percents
    progress = Column(Integer)

    # Special note. E.x. error
    text = Column(String)

    # Stdout
    stdout = Column(String)

    # Stderr
    stderr = Column(String)

    # Time of adding
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    # The name of the related project
    project_uuid = Column(
        String, ForeignKey('projects.project_uuid', ondelete='CASCADE')
    )

    # def __repr__(self):
    #    return "<Task(task_id='%s', task_type='%s',)>" % (
    #                         self.project_uuid)
