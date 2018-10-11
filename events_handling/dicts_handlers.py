from events_handling.notifications_spawner import send_notification


class DictHandlers(object):
    def __init__(self, socketio, dict_manager):
        self.socketio = socketio
        self.dict_manager = dict_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('dicts:get', namespace='/dicts')
        async def _cb_handle_dicts_get(sid, msg):
            project_uuid = int(msg.get('project_uuid', None))

            await self.socketio.emit(
                'dicts:set', 
                self.dict_manager.get(project_uuid=project_uuid),
                namespace='/dicts',
                room=sid
            )