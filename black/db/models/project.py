import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship

from black.db.models.base import Base
from black.db.sessions import Sessions


class ProjectDatabase(Base):
    __tablename__ = 'projects'

    project_uuid = Column(Integer, primary_key=True, autoincrement=True)
    project_name = Column(String)
    comment = Column(String, default='')

    # Marks whether any user has locked ips (hosts), disallowing adding new ones 
    ips_locked = Column(Boolean, default=False)
    hosts_locked = Column(Boolean, default=False)

    date_added = Column(DateTime, default=datetime.datetime.utcnow)

    ips_relationship = relationship('IPDatabase', cascade="all, delete-orphan")
    hosts_relationship = relationship('HostDatabase', cascade="all, delete-orphan")
    tasks_relationship = relationship('TaskDatabase', cascade="all, delete-orphan")
    scans_relationship = relationship('ScanDatabase', cascade="all, delete-orphan")

    session_spawner = Sessions()

    def dict(self):
        return {
            "project_uuid": self.project_uuid,
            "project_name": self.project_name,
            "comment": self.comment,
            "ips_locked": self.ips_locked,
            "hosts_locked": self.hosts_locked,
            "date_added": str(self.date_added)
        }

    @classmethod
    def create(cls, project_name):
        find_result = cls.find(project_name=project_name)

        if find_result["status"] == "success":
            if not find_result["projects"]:
                project = cls(project_name=project_name)

                try:
                    with cls.session_spawner.get_session() as session:
                        session.add(project)

                    return {"status": "success", "project": project.dict()}
                except Exception as exc:
                    return {"status": "error", "text": str(exc)}
                
            return {"status": "error", "text": "A project with that name exists"}

        return find_result

    @classmethod
    def find(cls, project_name=None, project_uuid=None):
        try:
            with cls.session_spawner.get_session() as session:
                project = session.query(cls)
                
                if project_name is not None:
                    project = project.filter(
                        cls.project_name == project_name
                    )

                if project_uuid is not None:
                    project = project.filter(
                        cls.project_uuid == project_uuid
                    )

                projects = project.all()

                return {"status": "success", "projects": projects}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    @classmethod
    def delete(cls, project_uuid=None):
        find_result = cls.find(
            project_uuid=project_uuid
        )

        if find_result["status"] == "success":
            if find_result["projects"]:
                project = find_result["projects"][0]
                project_uuid = project.project_uuid
                project_name = project.project_name
                
                try:
                    with cls.session_spawner.get_session() as session:
                        session.delete(project)

                    return {
                        "status": "success",
                        "project_uuid": project_uuid,
                        "project_name": project_name
                    }
                except Exception as exc:
                    return {"status": "error", "text": str(exc)}
            
            return {"status": "error", "text": "This project is already deleted"}

        # Resend the error which occured during find
        return find_result

    @classmethod
    def update(cls, project_uuid, new_name=None, new_comment=None):
        find_result = cls.find(project_uuid=project_uuid)

        if find_result["status"] == "success":
            if find_result["projects"]:
                project = find_result["projects"][0]

                try:
                    if new_name is not None:
                        project.project_name = new_name

                    if new_comment is not None:
                        project.comment = new_comment

                    with cls.session_spawner.get_session() as session:
                        session.add(project)

                        return {"status": "success", "project": project.dict()}

                except Exception as exc:
                    return {"status": "error", "text": str(exc)}
            
            return {"status": "error", "text": "This project no longer exists"}

        # Resend the error which occured during find
        return find_result


    def __repr__(self):
        return "<Project(project_name='%s')>" % (self.project_name)
