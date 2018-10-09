import datetime
import hashlib
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.exc import IntegrityError

from black.db.sessions import Sessions
from .base import Base


class DictDatabse(Base):
    """ Keeps data on the used dictionaries """
    __tablename__ = "dicts"

    # Primary key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Name of the dictionary, used to store the dict on
    # the disk of container
    name = Column(String)

    # Type of the dictionary. Specifically,
    # the name of the task which will use the dict
    dict_type = Column(String)

    # The content of the dictionary
    content = Column(Text)

    # Amount of lines in the file
    lines_count = Column(Integer)

    # md5 hashsum of the dictionary to make sure we
    # always use the latest version
    hashsum = Column(String)

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
            "name": self.name,
            "content": self.content,
            "lines_count": self.lines_count,
            "hashsum": self.hashsum,
            "project_uuid": self.project_uuid,
            "date_added": self.date_added
        }

    @classmethod
    def create(cls, name, content, project_uuid, lines_count=None, hashsum=None):

        db_object = cls(
            name=name, content=content, project_uuid=project_uuid,
            lines_count=len(content), hashsum=hashlib.md5(content).hexdigest()
        )

        try:
            with cls.session_spawner.get_session() as session:
                session.add(db_object)
        except IntegrityError:
            return {"status": "success", "name": name}
        except Exception as exc:
            print(str(exc))
            return {"status": "error", "text": str(exc), "name": name}
        else:
            return {"status": "success", "name": name}

    # @classmethod
    # def find(cls, project_uuid, targets=None, port_number=None):
    #     try:
    #         with cls.session_spawner.get_session() as session:
    #             creds_request = session.query(cls).filter(
    #                 cls.project_uuid == project_uuid
    #             )

    #             if targets:
    #                 creds_request = creds_request.filter(cls.target.in_(targets))
    #             if port_number:
    #                 creds_request = creds_request.filter(cls.port_number == port_number)

    #             creds = creds_request.all()

    #             return {"status": "success", "creds": creds}
    #     except Exception as exc:
    #         return {"status": "error", "text": str(exc)}

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

    @classmethod
    def delete(cls, project_uuid, dict_id=None, name=None):
        try:
            with cls.session_spawner.get_session() as session:
                to_delete_dict = session.query(cls).filter(
                    cls.project_uuid == project_uuid
                )

                if dict_id:
                    to_delete_creds = to_delete_dict.filter(
                        cls.id == id
                    )

                if name:
                    to_delete_dict = to_delete_dict.filter(
                        cls.name == name
                    )

                to_delete_creds.delete('fetch')

                return {"status": "success"}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
