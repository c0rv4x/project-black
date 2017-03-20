from flask_socketio import emit

from managers import TaskManager


def initialize(socketio):
    task_manager = TaskManager()

    @socketio.on('tasks:all:get')
    def handle_custom_event():
        """ When received this message, send back all the tasks """
        emit('tasks:all:get:back', {
            "status": "success", 
            "tasks": task_manager.get_tasks_native_objects()
        })
        # task_manager.create_task()#task_type, target, params, project_uuid)


    @socketio.on('tasks:create')
    def handle_project_creation(msg):
        """ When received this message, create a new tasks """
        print(msg)
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
