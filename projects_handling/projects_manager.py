import uuid


class ProjectManager(object):
    """ ProjectManager keeps track of all projects in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.projects = [{
            "projectName": "proj_name_1",
            "uuid": str(uuid.uuid4())}
        ]

    def get_projects(self):
        """ Returns the list of projects """
        return self.projects

    def create_project(self, project_name):
        """ Creates a new project """
        if len(self.find_project_by_name(project_name)) == 0:
            project = {
                "projectName": project_name,
                "uuid": str(uuid.uuid4()) 
            }

            # Append the new ptoject to existing
            self.projects.append(project)

            return {
                "status": "success",
                "new_project": project
            }
        else: 
            return {
                "status": "error",
                "text": 'Already exists that specific project name.'
            }

    def find_project_by_name(self, project_name):
        """ Serach for a project with a specific name """
        return list(filter(lambda x: x['projectName'] == project_name, self.projects))
