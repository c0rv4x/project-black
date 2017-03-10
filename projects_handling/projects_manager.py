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

    def find_project(self, project_name=None, project_uuid=None):
        """ Serach for a project with a specific name """
        filtered = self.projects

        if project_name:
            filtered = list(filter(lambda x: x['projectName'] == project_name, filtered))

        if project_uuid:
            filtered = list(filter(lambda x: x['uuid'] == project_uuid, filtered))

        return filtered

    def create_project(self, project_name):
        """ Creates a new project """
        if len(self.find_project(project_name=project_name)) == 0:
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

    def delete_project(self, project_name=None, project_uuid=None):
        """ Deletes a new project """
        filtered_projects = self.find_project(project_name, project_uuid)

        if len(filtered_projects) != 0:
            print(filtered_projects)
            for to_delete in filtered_projects:
                # Remove the project from everywhere
                self.projects.remove(to_delete)

            return {
                "status": "success"
            }
        else: 
            return {
                "status": "error",
                "text": 'No such projects.'
            }
