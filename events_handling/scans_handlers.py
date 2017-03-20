from flask_socketio import emit

from managers import ScanManager


def initialize(socketio):
    scan_manager = ScanManager()

    @socketio.on('scans:all:get')
    def handle_custom_event():
        """ When received this message, send back all the scans """
        socketio.emit('scans:all:get:back', {
            'status': 'success',
            'scans': scan_manager.get_scans()
        }, broadcast=True)
