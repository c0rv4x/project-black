""" Class keeps all projects list, allowing you to search it,
update, add, update and delete the elements. """
import uuid
import json

from black.black.db import Sessions
from black.black.db import ProjectDatabase

from common.logger import log


@log
class ProjectInner(object):
    """ Simple class for abstacting information on the project """

    def __init__(self, project_name, comment, project_uuid=None):
        if project_uuid:
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

    def set_project_name(self, project_name):
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
            project_db = ProjectDatabase(
                project_name=self._project_name,
                comment=self.comment
            )
            session.add(project_db)
            session.commit()
            self.sessions.destroy_session(session)

            self._project_uuid = project_db.project_uuid

            print(123)
            self.logger.warning(
                "Added project {}, {}".format(
                    self.get_project_uuid(), self.get_project_name()
                )
            )

            return {"status": "success", "project": self.to_dict()}
        except Exception as exc:
            self.logger.error(
                "{} while adding {}, {}".format(
                    str(exc), self.get_project_uuid(), self.get_project_name()
                )
            )
            return {"status": "error", "text": str(exc)}

    def update(self):
        """ Update the current state of object to the DB """
        try:
            session = self.sessions.get_new_session()
            db_obj = session.query(ProjectDatabase).filter_by(
                project_uuid=self._project_uuid
            ).first()
            db_obj.project_name = self._project_name
            db_obj.comment = self.comment

            session.commit()
            self.sessions.destroy_session(session)

            self.logger.info(
                "Updated project {}, {}, {}".format(
                    self.get_project_uuid(), self.get_project_name(), self.comment
                )
            )        
            return {"status": "success", "project": self.to_dict()}
        except Exception as exc:
            self.logger.error(
                "{} while updating project {}, {}, {}".format(
                    str(exc), self.get_project_uuid(), self.get_project_name(), self.comment
                )
            )

            return {"status": "error", "text": str(exc)}

    def delete(self):
        """ Delete this object from the DB """
        try:
            session = self.sessions.get_new_session()
            db_obj = session.query(ProjectDatabase).filter_by(
                project_uuid=self._project_uuid
            ).first()
            session.delete(db_obj)
            session.commit()
            self.sessions.destroy_session(session)

            self.logger.info(
                "Deleted project {}".format(
                    self.get_project_uuid()
                )
            ) 

            return {"status": "success"}
        except Exception as exc:
            self.logger.error(
                "{} while deleting project {}".format(
                    self.get_project_uuid()
                )
            )

            return {"status": "error", "text": str(exc)}


class ProjectManager(object):
    """ ProjectManager keeps track of all projects in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.projects = []

        self.sessions = Sessions()

        self.update_from_db()

    def get_projects(self):
        """ Returns the list of projects """
        return list(map(lambda x: x.to_dict(), self.projects))

    def update_from_db(self):
        """ Extract all the projects from the DB """
        session = self.sessions.get_new_session()
        projects_db = session.query(ProjectDatabase).all()
        self.projects = list(map(lambda x: ProjectInner(x.project_name, x.comment, x.project_uuid),
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
            project = ProjectInner(project_name, "")
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

        if project_name is None:
            project_name = found_project.get_project_name()

        if found_project:
            delete_result = found_project.delete()

            if delete_result["status"] == "success":
                self.projects.remove(found_project)

            delete_result['project_name'] = project_name

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

            update_result = found_project.update()

            return update_result

        return {"status": "error", "text": "Such project does not exist"}
