from flask_socketio import emit

from managers import ScanManager


def initialize(socketio):
    scan_manager = ScanManager()

    @socketio.on('projects:all:get')
    def handle_custom_event():
        """ When received this message, send back all the projects """
        socketio.emit('projects:all:get:back', {
            'status': 'success',
            'projects': scan_manager.get_scans()
        }, broadcast=True)
