import json
from flask_socketio import emit

from managers import ProjectManager


def initialize(socketio):
    project_manager = ProjectManager()

    @socketio.on('projects:all:get')
    def handle_custom_event():
        """ When received this message, send back all the projects """
        emit('projects:all:get:back', json.dumps(project_manager.get_projects()), broadcast=True)


    @socketio.on('projects:create')
    def handle_project_creation(msg):
        """ When received this message, create a new projects """
        project_name = msg['project_name']

        # Create new project (and register it)
        addition_result = project_manager.add_new_project(project_name)

        if addition_result["status"] == "success":
            # Send the project back
            emit('projects:create', json.dumps({
                'status': 'success',
                'new_project': addition_result["new_project"]
            }), broadcast=True)
        else:
            # Error occured
            emit('projects:create', json.dumps({
                'status': 'error',
                'text': addition_result["text"]
            }), broadcast=True)


    @socketio.on('projects:delete:project_uuid')
    def handle_project_creation(msg):
        """ When received this message, delete the project """
        project_uuid = msg

        # Delete new project (and register it)
        delete_result = project_manager.delete_project(project_uuid=project_uuid)

        if delete_result["status"] == "success":
            # Send the success result
            emit('projects:delete', json.dumps({
                'status': 'success',
                'project_uuid': project_uuid
            }), broadcast=True)

        else:
            # Error occured
            emit('projects:delete', json.dumps({
                'status': 'error',
                'text': delete_result["text"]
            }), broadcast=True)
            

    @socketio.on('projects:update')
    def handle_project_updating(msg):
        """ When received this message, update the project """
        project_uuid = msg['project_uuid']
        project_name = msg['project_name']
        comment = msg['comment']

        # Update the existing project
        updating_status = project_manager.update_project(project_uuid, project_name, comment)

        if updating_status["status"] == "success":
            # Send the project back
            emit('projects:update:' + project_uuid, json.dumps({
                'status': 'success',
                'new_project': {
                    'project_uuid': project_uuid,
                    'project_name': project_name,
                    'comment': comment,
                }
            }), broadcast=True)

        else:
            # Error occured
            emit('projects:update:' + project_uuid, json.dumps({
                'status': 'error',
                'text': updating_status["text"]
            }), broadcast=True)
