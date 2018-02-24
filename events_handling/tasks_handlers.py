""" Keep class for handling tasks events """


class TaskHandlers(object):
    """ Allows register handlers for tasks and sending tasks back """

    def __init__(self, socketio, task_manager):
        self.socketio = socketio
        self.task_manager = task_manager

    def register_handlers(self):
        """ The name says for itself """

        @self.socketio.on('tasks:all:get', namespace='/tasks')
        async def _cb_handle_tasks_get(sio, msg):
            """ When received this message, send back all the tasks """
            project_uuid = int(msg.get('project_uuid', None))
            await self.send_tasks_back(project_uuid, send_all=True)

        @self.socketio.on('tasks:create', namespace='/tasks')
        async def _cb_handle_tasks_create(sio, msg):
            """ When received this message, create a new tasks """
            task_type = msg["task_type"]
            filters = msg["filters"]
            params = msg["params"]
            project_uuid = msg["project_uuid"]

            tasks = self.task_manager.create_task(
                task_type, filters, params, project_uuid
            )

            await self.socketio.emit(
                'tasks:new', {'status': 'success',
                              'new_tasks': tasks},
                namespace='/tasks'
            )

        @self.socketio.on('tasks:delete:project_uuid', namespace='/tasks')
        async def _cb_handle_tasks_delete(sio, msg):
            """ When received this message, delete the project """

        @self.socketio.on('tasks:update', namespace='/tasks')
        async def _cb_handle_tasks_update(sio, msg):
            """ When received this message, update the project """

    async def send_tasks_back(self, project_uuid=None, send_all=False):
        """ Grab all tasks data and send them back to client """
        if send_all:
            tasks = self.task_manager.get_tasks_native_objects(
                project_uuid, get_all=True
            )

            # TODO, make broadcasting
            await self.socketio.emit(
                'tasks:all:get:back:all', {
                    "status": "success",
                    "project_uuid": project_uuid,
                    "tasks": tasks
                },
                namespace='/tasks'
            )
        else:
            tasks = self.task_manager.get_tasks_native_objects(
                project_uuid, get_all=False
            )

            if len(tasks['finished']) == 0 and len(tasks['active']) == 0:
                return

            # print(tasks, project_uuid, type(project_uuid))
            # TODO, make broadcasting
            await self.socketio.emit(
                'tasks:all:get:back:updated', {
                    "status": "success",
                    "project_uuid":  project_uuid,
                    "tasks": tasks
                },
                namespace='/tasks'
            )
