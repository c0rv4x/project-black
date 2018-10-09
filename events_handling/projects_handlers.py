""" Module only purpose is to create handlers for projects """
from events_handling.notifications_spawner import send_notification


class ProjectHandlers:
    def __init__(self, socketio, project_manager):
        self.socketio = socketio
        self.project_manager = project_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('projects:all:get', namespace='/projects')
        async def _cb_handle_projects_get(sid):
            """ When received this message, send back all the projects """
            await self.socketio.emit(
                'projects:all:get:back',
                {
                    'status': 'success',
                    'projects': self.project_manager.get_projects()
                },
                namespace='/projects'
            )

            await send_notification(
                self.socketio,
                "success",
                "Project created",
                "test",
                sid=sid
            )

        @self.socketio.on('projects:create', namespace='/projects')
        async def _cb_handle_project_create(sid, message):
            """ When received this message, create a new project """
            project_name = message['project_name']

            # Create new project (and register it)
            addition_result = self.project_manager.create_project(project_name)

            if addition_result["status"] == "success":
                # Send the project back
                await self.socketio.emit(
                    'projects:create', {
                        'status': 'success',
                        'new_project': addition_result["project"]
                    },
                    broadcast=True,
                    namespace='/projects')

                await send_notification(
                    self.socketio,
                    "success",
                    "Project created",
                    "Created project {}".format(project_name)
                )
            else:
                # Error occured
                await self.socketio.emit(
                    'projects:create',
                    {
                        'status': 'error',
                        'text': addition_result["text"]
                    },
                    broadcast=True,
                    namespace='/projects')

                await send_notification(
                    self.socketio,
                    "error",
                    "Project not created",
                    "Error occured while creating project: {}".format(
                        addition_result["text"]
                    )
                )

        @self.socketio.on('projects:delete:project_uuid', namespace='/projects')
        async def _cb_handle_project_delete(sid, message):
            """ When received this message, delete the project """
            project_uuid = message['project_uuid']

            # Delete new project (and register it)
            delete_result = self.project_manager.delete_project(
                project_uuid=project_uuid)

            if delete_result["status"] == "success":
                # Send the success result
                await self.socketio.emit(
                    'projects:delete',
                    {
                        'status': 'success',
                        'project_uuid': project_uuid
                    },
                    namespace='/projects')

                await send_notification(
                    self.socketio,
                    "success",
                    "Project deleted",
                    "Deleted project {}".format(delete_result['project_name'])
                )
            else:
                # Error occured
                await self.socketio.emit(
                    'projects:delete',
                    {
                        'status': 'error',
                        'text': delete_result["text"]
                    },
                    namespace='/projects')

                await send_notification(
                    self.socketio,
                    "error",
                    "Error on project delete",
                    "Error while deleting project {}".format(project_uuid)
                )

        @self.socketio.on('projects:update', namespace='/projects')
        async def _cb_handle_project_update(sid, message):
            """ When received this message, update the project (set the comment) """
            project_uuid = message['project_uuid']
            project_name = message['project_name']
            comment = message['comment']

            # Update the existing project
            updating_status = self.project_manager.update_project(
                project_uuid, project_name, comment)

            if updating_status["status"] == "success":
                # Send the project back
                await self.socketio.emit(
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
                    self.socketio,
                    "success",
                    "Project updated",
                    "Updated project {}".format(project_name)
                )
            else:
                # Error occured
                await self.socketio.emit(
                    'projects:update',
                    {
                        'status': 'error',
                        'text': updating_status["text"]
                    },
                    namespace='/projects')

                await send_notification(
                    self.socketio,
                    "error",
                    "Error while updating project",
                    "Error while updating project {}".format(project_name)
                )
