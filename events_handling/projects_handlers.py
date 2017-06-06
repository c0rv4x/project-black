from flask_socketio import emit


class ProjectHandlers(object):
    def __init__(self, socketio, project_manager):
        @socketio.on('projects:all:get', namespace='/projects')
        def handle_custom_event():
            """ When received this message, send back all the projects """
            socketio.emit('projects:all:get:back', {
                'status': 'success',
                'projects': project_manager.get_projects()
            }, broadcast=True, namespace='/projects')


        @socketio.on('projects:create', namespace='/projects')
        def handle_project_creation(msg):
            """ When received this message, create a new projects """
            project_name = msg['project_name']

            # Create new project (and register it)
            addition_result = project_manager.add_new_project(project_name)

            if addition_result["status"] == "success":
                # Send the project back
                socketio.emit('projects:create', {
                    'status': 'success',
                    'new_project': addition_result["new_project"]
                }, broadcast=True, namespace='/projects')
            else:
                # Error occured
                socketio.emit('projects:create', {
                    'status': 'error',
                    'text': addition_result["text"]
                }, broadcast=True, namespace='/projects')


        @socketio.on('projects:delete:project_uuid', namespace='/projects')
        def handle_project_creation(msg):
            """ When received this message, delete the project """
            project_uuid = msg['project_uuid']

            # Delete new project (and register it)
            delete_result = project_manager.delete_project(project_uuid=project_uuid)

            if delete_result["status"] == "success":
                # Send the success result
                socketio.emit('projects:delete', {
                    'status': 'success',
                    'project_uuid': project_uuid
                }, broadcast=True, namespace='/projects')

            else:
                # Error occured
                socketio.emit('projects:delete', {
                    'status': 'error',
                    'text': delete_result["text"]
                }, broadcast=True, namespace='/projects')
                

        @socketio.on('projects:update', namespace='/projects')
        def handle_project_updating(msg):
            """ When received this message, update the project """
            project_uuid = msg['project_uuid']
            project_name = msg['project_name']
            comment = msg['comment']

            # Update the existing project
            updating_status = project_manager.update_project(project_uuid, project_name, comment)

            if updating_status["status"] == "success":
                # Send the project back
                socketio.emit('projects:update', {
                    'status': 'success',
                    'new_project': {
                        'project_uuid': project_uuid,
                        'project_name': project_name,
                        'comment': comment,
                    }
                }, broadcast=True, namespace='/projects')

            else:
                # Error occured
                socketio.emit('projects:update', {
                    'status': 'error',
                    'text': updating_status["text"]
                }, broadcast=True, namespace='/projects')
