""" Simplt keeps handlers for scans (open ports) """


class ScanHandlers(object):
    """ This class is really simple to read """

    def __init__(self, socketio, scan_manager):
        self.socketio = socketio
        self.scan_manager = scan_manager

    def register_handlers(self):
        """ Register the single handler for returning all scans """
        @self.socketio.on('scans:stats:get', namespace='/scans')
        async def _cb_handle_custom_event(sio, msg):
            """ When received this message, send back all the scans """
            project_uuid = int(msg.get('project_uuid', None))

            await self.send_stats_back(project_uuid)

    async def send_stats_back(self, project_uuid=None):
        amount = self.scan_manager.count(project_uuid)

        await self.socketio.emit(
            'scans:stats:set', {
                'status': 'success',
                'project_uuid': project_uuid,
                'amount': amount
            },
            namespace='/scans'
        )

    async def notify_on_updated_scans(self, new_ips, project_uuid=None):
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

            await self.socketio.emit(
                'hosts:updated:ips', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_ips': new_ips
                },
                namespace='/hosts'
            )
