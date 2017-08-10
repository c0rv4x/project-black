from flask_socketio import emit


class ScanHandlers(object):
    def __init__(self, socketio, scan_manager):
        self.socketio = socketio
        self.scan_manager = scan_manager

        @socketio.on('scans:all:get', namespace='/scans')
        def handle_custom_event(msg):
            """ When received this message, send back all the scans """
            project_uuid = msg.get('project_uuid', None)
            self.send_scans_back(project_uuid)


    def send_scans_back(self, project_uuid=None):
        self.socketio.emit('scans:all:get:back', {
            'status': 'success',
            'project_uuid': project_uuid,
            'scans': self.scan_manager.get_scans(project_uuid)
        }, broadcast=True, namespace='/scans')
