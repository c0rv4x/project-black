from flask_socketio import emit


class ScanHandlers(object):
    def __init__(self, socketio, scan_manager):
        self.socketio = socketio
        self.scan_manager = scan_manager

        @socketio.on('scans:all:get')
        def handle_custom_event():
            """ When received this message, send back all the scans """
            self.send_scans_back()


    def send_scans_back(self):
        self.socketio.emit('scans:all:get:back', {
            'status': 'success',
            'scans': self.scan_manager.get_scans()
        }, broadcast=True)
