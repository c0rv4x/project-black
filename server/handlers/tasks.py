import json
from sanic import response

from server.handlers.utils import authorized_class_method


class TasksHandlers:
    def __init__(self, task_manager, socketio):
        self.task_manager = task_manager
        self.notifier = TasksNotifier(socketio)


    @authorized_class_method()
    async def cb_create_task(self, request, project_uuid):
        create_parameters = request.json
        task_type = create_parameters['task_type']
        filters = create_parameters['filters']
        params = create_parameters['params']

        tasks = self.task_manager.create_task(
            task_type, filters, params, project_uuid
        )

        await self.notifier.notify_on_created_tasks(project_uuid, tasks)

        return response.json({})


    @authorized_class_method()
    async def cb_get_tasks(self, request, project_uuid):
        tasks = self.task_manager.get_tasks(
            project_uuid, only_fresh=False
        )

        return response.json(tasks)


class TasksNotifier:
    def __init__(self, socketio):
        self.socketio = socketio

    async def notify_on_created_tasks(self, project_uuid, tasks):
        await self.socketio.emit(
            'tasks:new', {
                'project_uuid': project_uuid,
                'new_tasks': tasks
            },
            room=None, namespace='/tasks'
        )
