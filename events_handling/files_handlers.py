from flask_socketio import emit


class FileHandlers(object):
    def __init__(self, socketio, file_manager):
        self.socketio = socketio
        self.file_manager = file_manager

        @socketio.on('files:all:get', namespace='/files')
        def handle_custom_event():
            """ When received this message, send back all the files """
            self.send_files_back()


    def send_files_back(self):
        print("Sending files back")
        self.socketio.emit('files:all:get:back', {
            'status': 'success',
            'files': self.file_manager.get_files()
        }, broadcast=True, namespace='/files')
