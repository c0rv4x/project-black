""" Module only purpose is to create handlers for projects """
from events_handling.notifications_spawner import send_notification


def register_project_handlers(socketio, project_manager):
    """ Register project handlers """

    @socketio.on('projects:all:get', namespace='/projects')
    async def handle_custom_event(sid):
        """ When received this message, send back all the projects """
        await socketio.emit(
            'projects:all:get:back',
            {
                'status': 'success',
                'projects': project_manager.get_projects()
            },
            namespace='/projects'
        )
        print("Sending projects notification", sid)

        await send_notification(
            socketio,
            "success",
            "Project created",
            "test",
            sid=sid
        )

    @socketio.on('projects:create', namespace='/projects')
    async def handle_project_create(sid, msg):
        """ When received this message, create a new projects """
        project_name = msg['project_name']

        # Create new project (and register it)
        addition_result = project_manager.create_project(project_name)

        if addition_result["status"] == "success":
            # Send the project back
            await socketio.emit(
                'projects:create', {
                    'status': 'success',
                    'new_project': addition_result["project"]
                },
                broadcast=True,
                namespace='/projects')

            await send_notification(
                socketio,
                "success",
                "Project created",
                "Created project {}".format(project_name)
            )
        else:
            # Error occured
            await socketio.emit(
                'projects:create',
                {
                    'status': 'error',
                    'text': addition_result["text"]
                },
                broadcast=True,
                namespace='/projects')

            await send_notification(
                socketio,
                "error",
                "Project not created",
                "Error occured while creating project: {}".format(
                    addition_result["text"]
                )
            )

    @socketio.on('projects:delete:project_uuid', namespace='/projects')
    async def handle_project_delete(sid, msg):
        """ When received this message, delete the project """
        project_uuid = msg['project_uuid']

        # Delete new project (and register it)
        delete_result = project_manager.delete_project(
            project_uuid=project_uuid)

        project_name = delete_result['project_name']

        if delete_result["status"] == "success":
            # Send the success result
            await socketio.emit(
                'projects:delete',
                {
                    'status': 'success',
                    'project_uuid': project_uuid
                },
                namespace='/projects')

            await send_notification(
                socketio,
                "success",
                "Project deleted",
                "Deleted project {}".format(project_name)
            )
        else:
            # Error occured
            await socketio.emit(
                'projects:delete',
                {
                    'status': 'error',
                    'text': delete_result["text"]
                },
                namespace='/projects')

            await send_notification(
                socketio,
                "error",
                "Error on project delete",
                "Error while deleting project {}".format(project_name)
            )

    @socketio.on('projects:update', namespace='/projects')
    async def handle_project_update(sid, msg):
        """ When received this message, update the project """
        project_uuid = msg['project_uuid']
        project_name = msg['project_name']
        comment = msg['comment']

        # Update the existing project
        updating_status = project_manager.update_project(
            project_uuid, project_name, comment)

        if updating_status["status"] == "success":
            # Send the project back
            await socketio.emit(
                'projects:update',
                {
                    'status': 'success',
                    'new_project': {
                        'project_uuid': project_uuid,
                        'project_name': project_name,
                        'comment': comment,
                    }
                },
                namespace='/projects')

            await send_notification(
                socketio,
                "success",
                "Project updated",
                "Updated project {}".format(project_name)
            )
        else:
            # Error occured
            await socketio.emit(
                'projects:update',
                {
                    'status': 'error',
                    'text': updating_status["text"]
                },
                namespace='/projects')

            await send_notification(
                socketio,
                "error",
                "Error while updating project",
                "Error while updating project {}".format(project_name)
            )
