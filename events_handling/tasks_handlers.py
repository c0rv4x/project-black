from flask_socketio import emit


class TaskHandlers(object):
    def __init__(self, socketio, task_manager):
        self.socketio = socketio
        self.task_manager = task_manager     

        @socketio.on('tasks:all:get')
        def handle_custom_event():
            """ When received this message, send back all the tasks """
            self.send_tasks_back()

        @socketio.on('tasks:create')
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
            })


        @socketio.on('tasks:delete:project_uuid')
        def handle_project_creation(msg):
            """ When received this message, delete the project """

        @socketio.on('tasks:update')
        def handle_project_updating(msg):
            """ When received this message, update the project """

    def send_tasks_back(self):
        self.socketio.emit('tasks:all:get:back', {
            "status": "success", 
            "tasks": self.task_manager.get_tasks_native_objects()
        }, broadcast=True)   