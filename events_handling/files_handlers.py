""" Keeps class with file handlers """
class FileHandlers(object):
    """ The name says for itself"""

    def __init__(self, socketio, file_manager):
        self.socketio = socketio
        self.file_manager = file_manager

    def register_handlers(self):
        """ Register a single handler for files data """
        @self.socketio.on('files:stats:get', namespace='/files')
        async def _cb_handle_files_get(sio, msg):
            """ When received this message, send back all the files """
            project_uuid = int(msg.get('project_uuid', None))
            hostname = msg.get('hostname', None)

            await self.send_stats_back(project_uuid)

    async def send_stats_back(self, project_uuid=None):
        """ Get all files and send to all clients """
        await self.socketio.emit(
            'files:stats:set', {
                'status': 'success',
                'project_uuid': project_uuid,
                'amount': self.file_manager.count(project_uuid)
            },
            namespace='/files'
        )
