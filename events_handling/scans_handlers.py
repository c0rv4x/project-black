class ScanHandlers(object):
    def __init__(self, socketio, scan_manager):
        self.socketio = socketio
        self.scan_manager = scan_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('scans:stats:get', namespace='/scans')
        async def _cb_handle_custom_event(sio, msg):
            """ When received this message, send stats of the scans """
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
