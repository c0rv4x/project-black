""" Keeps class with file handlers """
import re


class FileHandlers(object):
    """ The name says for itself"""

    def __init__(self, socketio, file_manager):
        self.socketio = socketio
        self.file_manager = file_manager

        self.ip_regex = re.compile('^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')

    def register_handlers(self):
        """ Register a single handler for files data """
        @self.socketio.on('files:stats:get', namespace='/files')
        async def _cb_handle_files_get(sio, msg):
            """ When received this message, send back all the files """
            project_uuid = int(msg.get('project_uuid', None))
            hostname = msg.get('hostname', None)

            await self.send_stats_back(project_uuid)


    async def notify_on_updated_files(self, project_uuid, updated_target=None):
        """ Send a notification that files for specific ids have changed """
        if self.ip_regex.match(updated_target):
            await self.socketio.emit(
                'ips:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_ip_address': updated_target
                },
                namespace='/ips'
            )  
        else:
            await self.socketio.emit(
                'ips:updated', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'updated_hostname': updated_target
                },
                namespace='/hosts'
            )  

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