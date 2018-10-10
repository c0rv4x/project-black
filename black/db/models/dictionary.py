import datetime
import hashlib
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.exc import IntegrityError

from black.db.sessions import Sessions
from .base import Base


class DictDatabase(Base):
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
            "date_added": str(self.date_added)
        }

    @classmethod
    def create(cls, name, dict_type, content, project_uuid, lines_count=None, hashsum=None):

        db_object = cls(
            name=name, dict_type=dict_type, content=content,
            project_uuid=project_uuid, lines_count=content.count('\n'),
            hashsum=hashlib.md5(content.encode('utf-8')).hexdigest()
        )

        try:
            with cls.session_spawner.get_session() as session:
                session.add(db_object)
        except IntegrityError:
            return {"status": "success", "name": name, "dictionary": db_object}
        except Exception as exc:
            return {"status": "error", "text": str(exc), "name": name}
        else:
            return {"status": "success", "name": name, "dictionary": db_object}

    @classmethod
    def get(cls, project_uuid=None, dict_id=None, name=None):
        try:
            with cls.session_spawner.get_session() as session:
                dict_request = session.query(
                    # cls.id,
                    # cls.name,
                    # cls.dict_type,
                    # # cls.content, ## This is too big to keep in memory
                    # cls.lines_count,
                    # cls.hashsum,
                    # cls.project_uuid
                    cls
                )
                
                if project_uuid:
                    dict_request = dict_request.filter(cls.project_uuid == project_uuid)
                if dict_id:
                    dict_request = dict_request.filter(cls.dict_id == dict_id)
                if name:
                    dict_request = dict_request.filter(cls.name == name)

                dicts = dict_request.all()

                return {"status": "success", "dicts": dicts}
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

    @classmethod
    def delete(cls, project_uuid, dict_id=None, name=None):
        try:
            with cls.session_spawner.get_session() as session:
                to_delete_dict = session.query(cls).filter(
                    cls.project_uuid == project_uuid
                )

                if dict_id:
                    to_delete_dict = to_delete_dict.filter(
                        cls.id == id
                    )

                if name:
                    to_delete_dict = to_delete_dict.filter(
                        cls.name == name
                    )

                to_delete_dict.delete('fetch')

                return {"status": "success", "dict_id": to_delete_dict.dict_id}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
