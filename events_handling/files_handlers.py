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
