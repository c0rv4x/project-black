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
            filters = msg.get('filters')

            get_result = self.file_manager.get_stats_ips(project_uuid, ip_ids, filters)
            get_result["project_uuid"] = project_uuid

            await self.socketio.emit(
                'files:stats:add:ips',
                get_result,
                room=sio,
                namespace='/files'
            )                

        @self.socketio.on('files:stats:get:host', namespace='/files')
        async def _cb_handle_files_stats_get(sio, msg):
            """ Returns dicts with statistics on files for selected targets """
            project_uuid = int(msg.get('project_uuid', None))
            host_ids = msg.get('host_ids', [])
            filters = msg.get('filters')

            get_result = self.file_manager.get_stats_hosts(project_uuid, host_ids, filters)
            get_result["project_uuid"] = project_uuid

            await self.socketio.emit(
                'files:stats:add:hosts',
                get_result,
                room=sio,
                namespace='/files'
            )                

        @self.socketio.on('files:get:hosts', namespace='/files')
        async def _cb_handle_files_data_get(sio, msg):
            """ Returns dicts with files for selected targets """
            project_uuid = int(msg.get('project_uuid', None))
            host = msg.get('host')
            port_number = int(msg.get('port_number'))
            limit = int(msg.get('limit'))
            offset = int(msg.get('offset'))
            filters = msg.get('filters')

            get_result = self.file_manager.get_files_hosts(host, port_number, limit, offset, filters)
            if get_result["status"] == "success":
                await self.socketio.emit(
                    'files:add:hosts', {
                        'status': 'success',
                        'project_uuid': project_uuid,
                        'host': host,
                        'port_number': port_number,                        
                        'files': list(map(
                            lambda file: file.dict(),
                            get_result['files']
                        ))
                    },
                    room=sio,
                    namespace='/files'
                )                
            else:
                await self.socketio.emit(
                    'files:add',
                    get_result,
                    room=sio,
                    namespace='/files'
                )  

        @self.socketio.on('files:get:ips', namespace='/files')
        async def _cb_handle_files_data_get(sio, msg):
            """ Returns dicts with files for selected targets """
            project_uuid = int(msg.get('project_uuid', None))
            ip = msg.get('ip')
            port_number = int(msg.get('port_number'))
            limit = int(msg.get('limit'))
            offset = int(msg.get('offset'))
            filters = msg.get('filters')

            get_result = self.file_manager.get_files_ips(ip, port_number, limit, offset, filters)
            if get_result["status"] == "success":
                await self.socketio.emit(
                    'files:add:ips', {
                        'status': 'success',
                        'project_uuid': project_uuid,
                        'ip': ip,
                        'port_number': port_number,
                        'files': list(map(
                            lambda file: file.dict(),
                            get_result['files']
                        ))
                    },
                    room=sio,
                    namespace='/files'
                )                
            else:
                await self.socketio.emit(
                    'files:add',
                    get_result,
                    room=sio,
                    namespace='/files'
                )

    async def send_count_back(self, project_uuid=None):
        count_result = self.file_manager.count(project_uuid)
        count_result['project_uuid'] = project_uuid

        await self.socketio.emit(
            'files:count:set', count_result,
            namespace='/files'
        )
