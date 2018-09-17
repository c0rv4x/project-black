""" Keeps class with creds handlers """


class CredHandlers(object):
    """ The name says for itself"""

    def __init__(self, socketio, creds_manager):
        self.socketio = socketio
        self.creds_manager = creds_manager

    def register_handlers(self):
        """ Register all handlers for credentials """
        @self.socketio.on('creds:stats:get', namespace='/creds')
        async def _cb_handle_files_stats(sid, msg):
            """ When received this message, send back count of creds for project """
            project_uuid = int(msg.get('project_uuid', None))
            print("Getting stats for project_uuid", {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'amount': self.creds_manager.count(project_uuid)['amount']
                }, sid)

            await self.socketio.emit(
                'creds:stats:set', 
                self.creds_manager.count(project_uuid)['amount'],
                namespace='/creds',
                room=sid
            )

        @self.socketio.on('creds:get', namespace='/creds')
        async def _cb_handle_files_get(sid, msg):
            """ When received this message, send back count of creds for project """
            project_uuid = int(msg.get('project_uuid', None))
            targets = msg.get('targets', None)

            await self.socketio.emit(
                'creds:get:back',
                self.creds_manager.get_creds(targets=targets, project_uuid=project_uuid),
                namespace='/creds',
                room=sid   
            )
