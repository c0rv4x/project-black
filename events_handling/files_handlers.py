""" Keeps class with file handlers """


class FileHandlers(object):
    """ The name says for itself"""

    def __init__(self, socketio, file_manager):
        self.socketio = socketio
        self.file_manager = file_manager

    def register_handlers(self):
        """ Register a single handler for files data """

        @self.socketio.on('files:all:get', namespace='/files')
        async def _cb_handle_files_get(sio, msg):
            """ When received this message, send back all the files """
            project_uuid = msg.get('project_uuid', None)
            hostname = msg.get('hostname', None)
            if hostname:
                await self.send_files_back(project_uuid, hostname, single=True)
            else:
                await self.send_files_back(project_uuid, hostname)

        # @self.socketio.on('files:all:get:single', namespace='/files')
        # async def _cb_handle_files_get_single_host(sio, msg):
        #     """ When received this message, send back all the files """
        #     project_uuid = msg.get('project_uuid', None)
        #     hostname = msg.get('hostname', None)
        #     await self.send_files_back(project_uuid, hostname, single=True)

    async def send_files_back(
        self, project_uuid=None, hostname=None, single=False
    ):
        """ Get all files and send to all clients """
        if single:
            await self.socketio.emit(
                'files:all:get:single:back', {
                    'status':
                        'success',
                    'project_uuid':
                        project_uuid,
                    'files':
                        self.file_manager.get_files(project_uuid, hostname)
                },
                broadcast=False,
                namespace='/files'
            )
        else:
            await self.socketio.emit(
                'files:all:get:back', {
                    'status':
                        'success',
                    'project_uuid':
                        project_uuid,
                    'files':
                        self.file_manager.get_files(project_uuid, hostname)
                },
                broadcast=True,
                namespace='/files'
            )
