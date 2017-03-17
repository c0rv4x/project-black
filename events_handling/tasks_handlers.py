from flask_socketio import emit

# from managers import ProjectManager


def initialize(socketio):
    # project_manager = ProjectManager()

    @socketio.on('tasks:all:get')
    def handle_custom_event():
        """ When received this message, send back all the tasks """
        print('tasks:all:get')


    @socketio.on('tasks:create')
    def handle_project_creation(msg):
        """ When received this message, create a new tasks """


    @socketio.on('tasks:delete:project_uuid')
    def handle_project_creation(msg):
        """ When received this message, delete the project """

    @socketio.on('tasks:update')
    def handle_project_updating(msg):
        """ When received this message, update the project """
