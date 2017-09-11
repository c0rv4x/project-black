""" Class keeps all projects list, allowing you to search it,
update, add, update and delete the elements. """
import uuid
import json

from black.black.db import Sessions
from black.black.db import Project as ProjectDB


class ProjectInner(object):
    """ Simple class for abstacting information on the project """

    def __init__(self, project_uuid, project_name, comment):
        self._project_uuid = project_uuid
        self._project_name = project_name
        self.comment = comment

        self.sessions = Sessions()

    def get_project_uuid(self):
        """ The name says for itself """
        return self._project_uuid

    def get_project_name(self):
        """ The name says for itself """
        return self._project_name

    def set_project_uuid(self, project_name):
        """ The name says for itself """
        self._project_name = project_name

    def to_dict(self):
        """ Serialize the object to dict """
        return {
            "project_uuid": self._project_uuid,
            "project_name": self._project_name,
            "comment": self.comment,
        }

    def save(self):
        """ Save the current state of object to the DB """
        try:
            session = self.sessions.get_new_session()
            project_db = ProjectDB(
                project_uuid=self._project_uuid,
                project_name=self._project_name,
                comment=self.comment
            )
            session.add(project_db)
            session.commit()
            self.sessions.destroy_session(session)
            return {"status": "success", "project": self.to_dict()}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    def delete(self):
        """ Delete this object from the DB """
        try:
            session = self.sessions.get_new_session()
            db_obj = session.query(ProjectDB).filter_by(
                project_uuid=self._project_uuid
            ).first()
            session.delete(db_obj)
            session.commit()
            self.sessions.destroy_session(session)

            return {"status": "success"}
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

    def update(self):
        """ Update fields of this object and save to the DB """
        pass


class ProjectManager(object):
    """ ProjectManager keeps track of all projects in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.projects = []
        self.update_from_db()

    def get_projects(self):
        """ Returns the list of projects """
        return list(map(lambda x: x.to_dict(), self.projects))

    def update_from_db(self):
        """ Extract all the projects from the DB """
        session = self.sessions.get_new_session()
        projects_db = session.query(ProjectDB).all()
        self.projects = list(map(lambda x: ProjectInner(x.project_uuid, x.project_name, x.comment),
            projects_db))
        self.sessions.destroy_session(session)

    def find_project(self, project_name=None, project_uuid=None):
        """ Serach for a project with a specific name and project_uuid """
        filtered = self.projects

        if project_name:
            filtered = list(
                filter(
                    lambda x: x.get_project_name() == project_name, filtered
                )
            )

        if project_uuid:
            filtered = list(
                filter(
                    lambda x: x.get_project_uuid() == project_uuid, filtered
                )
            )

        return filtered[0] if filtered else None

    def create_project(self, project_name):
        """ Create a new project instance, save it to db and add
        minimal information for the web. """
        if not self.find_project(project_name=project_name):
            project_uuid = str(uuid.uuid4())

            project = ProjectInner(project_uuid, project_name, "")
            save_result = project.save()

            if save_result["status"] == "success":
                self.projects.append(project)

            return save_result

        return {"status": "error", "text": "A project with that name exists"}

    def delete_project(self, project_name=None, project_uuid=None):
        """ Deletes a new project """
        found_project = self.find_project(
            project_uuid=project_uuid, project_name=project_name
        )

        if found_project:
            delete_result = found_project.delete()

            if delete_result["status"] == "success":
                self.projects.remove(found_project)

            return delete_result

        return {"status": "error", "text": "No such project"}

    def update_project(self, project_uuid, project_name=None, comment=None):
        """ Update project base on uuid """
        found_project = self.find_project(
            project_uuid=project_uuid, project_name=project_name
        )

        if found_project:
            if project_name:
                found_project.set_project_name(project_name)

            if comment:
                found_project.comment = comment

            save_result = found_project.save()

            return save_result

        return {"status": "error", "text": "Such project does not exist"}
