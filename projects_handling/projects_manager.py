import uuid

from black.black.db import sessions, Project


class ProjectManager(object):
    """ ProjectManager keeps track of all projects in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.projects = []
        self.update_from_db()
        # self.create_project("proj_name_1")

    def get_projects(self):
        """ Returns the list of projects """
        return self.projects

    def update_from_db(self):
        """ Extract all the projects from the DB """
        session = sessions.get_new_session()
        projects_db = session.query(Project).all()
        self.projects = list(map(lambda x: {
            'project_name': x.project_name, 
            'project_uuid': x.project_uuid,
            'comment': x.comment
            }, 
            projects_db))
        sessions.destroy_session(session)        

    def find_project(self, project_name=None, project_uuid=None):
        """ Serach for a project with a specific name """
        filtered = self.projects

        if project_name:
            filtered = list(filter(lambda x: x['project_name'] == project_name, filtered))

        if project_uuid:
            filtered = list(filter(lambda x: x['project_uuid'] == project_uuid, filtered))

        return filtered

    def create_project(self, project_name):
        """ Create a new project instance, save it to db and add
        minimal information for the web. """
        if len(self.find_project(project_name=project_name)) == 0:
            project_uuid = str(uuid.uuid4())

            try: 
                session = sessions.get_new_session()
                project_db = Project(project_uuid=project_uuid,
                                     project_name=project_name,
                                     comment="")
                session.add(project_db)
                session.commit()
                sessions.destroy_session(session)
            except Exception as e:
                return {
                    "status": "error",
                    "text": str(e)
                }    

            project = {
                "project_name": project_name,
                "project_uuid": project_uuid
            }

            # Append the new ptoject to existing
            self.projects.append(project)

            return {
                "status": "success",
                "project": project
            }
        else:
            return {
                "status": "error",
                "text": 'Already exists that specific project name.'
            }            

    def add_new_project(self, project_name):
        """ Creates a new project """
        create_result = self.create_project(project_name)
        if create_result['status'] == 'success':
            return {
                "status": "success",
                "new_project": create_result['project']
            }
        else: 
            return {
                "status": "error",
                "text": create_result["text"]
            }

    def delete_project(self, project_name=None, project_uuid=None):
        """ Deletes a new project """
        filtered_projects = self.find_project(project_name, project_uuid)

        if len(filtered_projects) != 0:
            for to_delete in filtered_projects:
                # Remove the project from everywhere
                try: 
                    session = sessions.get_new_session()
                    db_obj = session.query(Project).filter_by(project_uuid=to_delete['project_uuid']).first()
                    session.delete(db_obj)
                    session.commit()
                    sessions.destroy_session(session)

                    self.projects.remove(to_delete)
                except Exception as e:
                    return {
                        "status": "error",
                        "text": str(e)
                    }    


            return {
                "status": "success"
            }
        else: 
            return {
                "status": "error",
                "text": 'No such projects.'
            }

    def update_project(self, project_uuid, project_name=None, comment=None):
        """ Update project base on uuid """
        try:
            session = sessions.get_new_session()
            project_db = session.query(Project).filter_by(project_uuid=project_uuid).first()
            if project_name:
                project_db.project_name = project_name
            if comment:
                project_db.comment = comment  
            session.commit()          
            sessions.destroy_session(session)
        except Exception as e:
            return {
                "status": "error",
                "text": str(e)
            }
        else:
            return {
                "status": "success"
            }