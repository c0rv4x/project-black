""" Keep class for handling tasks events """
from events_handling.notifications_spawner import send_notification


class TaskHandlers(object):
    """ Allows register handlers for tasks and sending tasks back """

    def __init__(self, socketio, task_manager):
        self.socketio = socketio
        self.task_manager = task_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('tasks:all:get', namespace='/tasks')
        async def _cb_handle_tasks_get(sio, msg):
            """ When received this message, send back all the tasks """
            project_uuid = int(msg.get('project_uuid', None))
            send_all = msg.get('send_all')

            await self.send_tasks_back(project_uuid, send_all=send_all)

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
                'tasks:new',
                {
                    'status': 'success',
                    'new_tasks': tasks
                },
                namespace='/tasks'
            )

            await send_notification(
                self.socketio,
                "success",
                "Tasks created",
                "Created {} {} tasks".format(len(tasks), task_type),
                project_uuid=project_uuid
            )

    async def send_tasks_back(self, project_uuid=None, send_all=False):
        """ Grab all tasks data and send them back to client """
        if send_all:
            tasks = self.task_manager.get_tasks(
                project_uuid, only_fresh=False
            )

            await self.socketio.emit(
                'tasks:all:get:back:all',
                {
                    "status": "success",
                    "project_uuid": project_uuid,
                    "tasks": tasks
                },
                namespace='/tasks'
            )
        else:
            tasks = self.task_manager.get_tasks(
                project_uuid, only_fresh=True
            )

            if len(tasks['finished']) == 0 and len(tasks['active']) == 0:
                return

            await self.socketio.emit(
                'tasks:all:get:back:updated',
                {
                    "status": "success",
                    "project_uuid":  project_uuid,
                    "tasks": tasks
                },
                namespace='/tasks'
            )
