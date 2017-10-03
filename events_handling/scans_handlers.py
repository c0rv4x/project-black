""" Simplt keeps handlers for scans (open ports) """


class ScanHandlers(object):
    """ This class is really simple to read """

    def __init__(self, socketio, scan_manager):
        self.socketio = socketio
        self.scan_manager = scan_manager


    def register_handlers(self):
        """ Register the single handler for returning all scans """
        @self.socketio.on('scans:all:get', namespace='/scans')
        async def _cb_handle_custom_event(sio, msg):
            """ When received this message, send back all the scans """
            project_uuid = msg.get('project_uuid', None)
            await self.send_scans_back(project_uuid)

    async def send_scans_back(self, project_uuid=None):
        """ Finds all scans for the project and sends them back """
        print(project_uuid)
        print(self.scan_manager.get_scans(project_uuid))
        await self.socketio.emit(
            'scans:all:get:back', {
                'status': 'success',
                'project_uuid': project_uuid,
                'scans': self.scan_manager.get_scans(project_uuid)
            },
            broadcast=True,
            namespace='/scans'
        )
