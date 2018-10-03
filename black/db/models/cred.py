import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.exc import IntegrityError

from black.db.sessions import Sessions
from .base import Base


class CredDatabase(Base):
    """ Keeps data on the found credentials """
    __tablename__ = "creds"
    __table_args__ = (
        UniqueConstraint(
            'target', 'port_number', 'code', 'candidate', 'mesg', 'project_uuid'
        ),
    )
    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Status code of the request
    code = Column(String)

    # Response size
    size = Column(Integer)
    
    # Time taken to complete the request
    time = Column(String)

    # Login and password divided by ':'
    candidate = Column(String)

    # Number of the current request in the whole task.
    # Not sure we need it, but patator keeps it
    num = Column(Integer)

    # Response message for this request
    mesg = Column(String)

    # Other info from the requester which did not fit to the above fields
    other = Column(String)

    # Name of the module used to bruteforce the target
    # Can be used to extract the name of the service
    service = Column(String)

    # Target (this is either IP or hostname)
    target = Column(String, index=True)

    # Port
    port_number = Column(Integer)

    # ID of the related task (the task, which resulted in the current data)
    task_id = Column(String, ForeignKey('tasks.task_id'))

    # The name of the related project
    project_uuid = Column(
        Integer, ForeignKey('projects.project_uuid', ondelete='CASCADE'), index=True
    )

    # Date of added
    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    session_spawner = Sessions()

    def dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "size": self.size,
            "time": self.time,
            "candidate": self.candidate,
            "num": self.num,
            "mesg": self.mesg,
            "other": self.other,
            "service": self.service,
            "target": self.target,
            "port_number": self.port_number,
            "task_id": self.task_id,
            "project_uuid": self.project_uuid,
            "date_added": str(self.date_added)
        }

    @classmethod
    def create(cls, code=None, size=None, time=None, candidate=None,
               num=None, mesg=None, service=service, target=None,
               port_number=None, task_id=None, project_uuid=None,
               **args
        ):

        db_object = cls(
            code=code,
            size=size,
            time=time,
            candidate=candidate,
            num=num,
            mesg=mesg,
            service=service,
            target=target,
            port_number=port_number,
            task_id=task_id,
            project_uuid=project_uuid,
            other=str(args)
        )

        try:
            with cls.session_spawner.get_session() as session:
                session.add(db_object)
        except IntegrityError:
            return {"status": "success", "target": target}
        except Exception as exc:
            print(str(exc))
            return {"status": "error", "text": str(exc), "target": target}
        else:
            return {"status": "success", "target": target}

    @classmethod
    def find(cls, project_uuid, targets=None, port_number=None):
        try:
            with cls.session_spawner.get_session() as session:
                creds_request = session.query(cls).filter(
                    cls.project_uuid == project_uuid
                )

                if targets:
                    creds_request = creds_request.filter(cls.target.in_(targets))
                if port_number:
                    creds_request = creds_request.filter(cls.port_number == port_number)

                creds = creds_request.all()

                return {"status": "success", "creds": creds}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    @classmethod
    def count(cls, project_uuid):
        try:
            with cls.session_spawner.get_session() as session:
                amount = session.query(cls).filter(
                    cls.project_uuid == project_uuid
                ).count()

                return {"status": "success", "amount": amount}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
