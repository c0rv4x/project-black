""" Simplt keeps handlers for scans (open ports) """


class ScanHandlers(object):
    """ This class is really simple to read """

    def __init__(self, socketio, scan_manager):
        self.socketio = socketio
        self.scan_manager = scan_manager


    def register_handlers(self):
        """ Register the single handler for returning all scans """
        @self.socketio.on('scans:part:get', namespace='/ips')
        async def _cb_handle_custom_event(sio, msg):
            """ When received this message, send back all the scans """
            project_uuid = msg.get('project_uuid', None)
            ips = msg.get('ips', [])
            await self.send_scans_back(project_uuid, ips)

    async def send_scans_back(self, new_ips, project_uuid=None):
        """ Finds all scans for the project and sends them back """
        print("Sending back new_ips {} , {}".format(new_ips, project_uuid))

        if new_ips:
            await self.socketio.emit(
                'ips:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_ips': new_ips
                },
                namespace='/ips'
            )
