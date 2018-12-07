import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy import or_

from .base import Base, asyncify
from black.db.sessions import Sessions


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
        Integer, ForeignKey('projects.project_uuid', ondelete='CASCADE'), index=True
    )

    session_spawner = Sessions()

    def dict(self):
        return {
            "task_id": self.task_id,
            "task_type": self.task_type,
            "target": self.target,
            "params": self.params,
            "status": self.status,
            "progress": self.progress,
            "text": self.text,
            "stdout": self.stdout,
            "stderr": self.stderr,
            "project_uuid": self.project_uuid
        }

    @classmethod
    @asyncify
    def get_tasks(cls, project_uuid, ips=None, hosts=None):
        try:
            with cls.session_spawner.get_session() as session:
                tasks = session.query(cls)
                
                if ips is not None:
                    like_filters = list(map(
                        lambda ip: cls.target.like("%,{},%".format(ip)),
                        ips
                    )) + list(map(
                        lambda ip: cls.target.like("%,{}".format(ip)),
                        ips
                    )) + list(map(
                        lambda ip: cls.target.like("{},%".format(ip)),
                        ips
                    ))

                    tasks = tasks.filter(
                        or_(
                            cls.target.in_(ips),
                            *like_filters
                        )
                    )

                if hosts is not None:
                    like_filters = list(map(
                        lambda host: cls.target.like("{}:%".format(host)),
                        hosts
                    ))

                    tasks = tasks.filter(
                        or_(
                            # cls.target.in_(hosts),
                            *like_filters
                        )
                    )

                if project_uuid is not None:
                    tasks = tasks.filter(
                        cls.project_uuid == project_uuid
                    )

                finished = tasks.filter(or_(cls.status == 'Finished', cls.status == 'Aborted')).all()
                active = tasks.filter(cls.status != 'Finished', cls.status != 'Aborted').all()

                return {"status": "success", "finished": finished, "active": active}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}        

    # def __repr__(self):
    #    return "<Task(task_id='%s', task_type='%s',)>" % (
    #                         self.project_uuid)
