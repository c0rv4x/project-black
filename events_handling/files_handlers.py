""" Keeps class with file handlers """
class FileHandlers(object):
    def __init__(self, socketio, file_manager):
        self.socketio = socketio
        self.file_manager = file_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('files:count:get', namespace='/files')
        async def _cb_handle_files_get(sio, msg):
            """ When received this message, send back all the files """
            project_uuid = int(msg.get('project_uuid', None))

            await self.send_count_back(project_uuid)

        @self.socketio.on('files:stats:get:ip', namespace='/files')
        async def _cb_handle_files_stats_get(sio, msg):
            """ Returns dicts with statistics on files for selected targets """
            project_uuid = int(msg.get('project_uuid', None))
            ip_ids = msg.get('ip_ids', [])

            get_result = self.file_manager.get_stats_ips(project_uuid, ip_ids)

            if get_result["status"] == "success":
                await self.socketio.emit(
                    'files:stats:add', {
                        'status': 'success',
                        'project_uuid': project_uuid,
                        'stats': get_result['stats']
                    },
                    namespace='/files'
                )                
            else:
                await self.socketio.emit(
                    'files:stats:add',
                    get_result,
                    namespace='/files'
                )                

    async def send_count_back(self, project_uuid=None):
        """ Get all files and send to all clients """
        await self.socketio.emit(
            'files:count:set', {
                'status': 'success',
                'project_uuid': project_uuid,
                'amount': self.file_manager.count(project_uuid)
            },
            namespace='/files'
        )
