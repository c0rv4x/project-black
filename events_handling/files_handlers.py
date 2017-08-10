from flask_socketio import emit


class FileHandlers(object):
    def __init__(self, socketio, file_manager):
        self.socketio = socketio
        self.file_manager = file_manager

        @socketio.on('files:all:get', namespace='/files')
        def handle_custom_event(msg):
            """ When received this message, send back all the files """
            project_uuid = msg.get('project_uuid', None)
            self.send_files_back(project_uuid)


    def send_files_back(self, project_uuid=None):
        self.socketio.emit('files:all:get:back', {
            'status': 'success',
            'project_uuid': project_uuid,
            'files': self.file_manager.get_files(project_uuid)
        }, broadcast=True, namespace='/files')
