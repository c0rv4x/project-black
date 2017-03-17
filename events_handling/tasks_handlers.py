from flask_socketio import emit

from managers import TaskManager


def initialize(socketio):
    task_manager = TaskManager()

    @socketio.on('tasks:all:get')
    def handle_custom_event():
        """ When received this message, send back all the tasks """
        emit('tasks:all:get:back', task_manager.get_tasks())
        # task_manager.create_task()#task_type, target, params, project_uuid)


    @socketio.on('tasks:create')
    def handle_project_creation(msg):
        """ When received this message, create a new tasks """


    @socketio.on('tasks:delete:project_uuid')
    def handle_project_creation(msg):
        """ When received this message, delete the project """

    @socketio.on('tasks:update')
    def handle_project_updating(msg):
        """ When received this message, update the project """
