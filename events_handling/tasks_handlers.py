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
            project_uuid = msg.get('project_uuid', None)
            await self.send_tasks_back(project_uuid, send_all=True)

        @self.socketio.on('tasks:create', namespace='/tasks')
        async def _cb_handle_tasks_create(sio, msg):
            """ When received this message, create a new tasks """
            task_type = msg["task_type"]
            target = msg["target"]
            params = msg["params"]
            project_uuid = msg["project_uuid"]

            task = self.task_manager.create_task(
                task_type, target, params, project_uuid
            )

            await self.socketio.emit(
                'tasks:new', {'status': 'success',
                              'new_task': task},
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
            await self.socketio.emit(
                'tasks:all:get:back:all', {
                    "status": "success",
                    'project_uuid': project_uuid,
                    "tasks": tasks
                },
                broadcast=True,
                namespace='/tasks'
            )
        else:
            tasks = self.task_manager.get_tasks_native_objects(
                project_uuid, get_all=False
            )
            print("sending tasks for project#", project_uuid)
            await self.socketio.emit(
                'tasks:all:get:back:updated', {
                    "status": "success",
                    'project_uuid': project_uuid,
                    "tasks": tasks
                },
                broadcast=True,
                namespace='/tasks'
            )
