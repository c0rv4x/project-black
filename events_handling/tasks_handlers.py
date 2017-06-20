from flask_socketio import emit


class TaskHandlers(object):
    def __init__(self, socketio, task_manager):
        self.socketio = socketio
        self.task_manager = task_manager     

        @socketio.on('tasks:all:get', namespace='/tasks')
        def handle_custom_event():
            """ When received this message, send back all the tasks """
            self.send_tasks_back(send_all=True)

        @socketio.on('tasks:create', namespace='/tasks')
        def handle_project_creation(msg):
            """ When received this message, create a new tasks """
            task_type = msg["task_type"]
            target = msg["target"]
            params = msg["params"]
            project_uuid = msg["project_uuid"]

            task = task_manager.create_task(task_type, target, params, project_uuid)

            socketio.emit('tasks:new', {
                'status': 'success',
                'new_task': task
            }, namespace='/tasks')

        @socketio.on('tasks:delete:project_uuid', namespace='/tasks')
        def handle_project_creation(msg):
            """ When received this message, delete the project """

        @socketio.on('tasks:update', namespace='/tasks')
        def handle_project_updating(msg):
            """ When received this message, update the project """

    def send_tasks_back(self, send_all=False):
        if send_all:
            tasks = self.task_manager.get_tasks_native_objects(get_all=True)
            self.socketio.emit('tasks:all:get:back:all', {
                "status": "success", 
                "tasks": tasks
            }, broadcast=True, namespace='/tasks')
        else:
            tasks = self.task_manager.get_tasks_native_objects(get_all=False)
            self.socketio.emit('tasks:all:get:back:updated', {
                "status": "success", 
                "tasks": tasks
            }, broadcast=True, namespace='/tasks')            