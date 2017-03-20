from flask_socketio import emit

from managers import TaskManager


thread = None

def initialize(socketio):
    def infinite_sender_of_tasks(task_manager):
        print("infitinite started")
        while True:
            socketio.sleep(0.7)
            send_tasks_back(task_manager)

    def send_tasks_back(task_manager):
        socketio.emit('tasks:all:get:back', {
            "status": "success", 
            "tasks": task_manager.get_tasks_native_objects()
        }, broadcast=True)        

    task_manager = TaskManager()

    @socketio.on('tasks:all:get')
    def handle_custom_event():
        """ When received this message, send back all the tasks """
        global thread

        send_tasks_back(task_manager)

        if thread is None:
            thread = socketio.start_background_task(target=infinite_sender_of_tasks, task_manager=task_manager)

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
