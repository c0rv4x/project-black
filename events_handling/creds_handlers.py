""" Keeps class with creds handlers """
import re

from events_handling.notifications_spawner import send_notification


class CredHandlers(object):
    """ The name says for itself"""

    def __init__(self, socketio, creds_manager):
        self.socketio = socketio
        self.creds_manager = creds_manager

        self.ip_regex = re.compile(
            '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$'
        )

        self.register_handlers()


    def register_handlers(self):
        """ Register all handlers for credentials """
        @self.socketio.on('creds:stats:get', namespace='/creds')
        async def _cb_handle_files_stats(sid, msg):
            """ When received this message, send back count of creds for project """
            project_uuid = int(msg.get('project_uuid', None))

            await self.socketio.emit(
                'creds:stats:set', 
                self.creds_manager.count(project_uuid),
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

        @self.socketio.on('creds:delete', namespace='/creds')
        async def _cb_handle_files_delete(sid, msg):
            """ Delete all creds specified by project_uuid, targets and port_number """
            project_uuid = int(msg.get('project_uuid', None))
            targets = msg.get('targets', None)
            port_number = int(msg.get('port_number', None))

            delete_result = self.creds_manager.delete(
                project_uuid=project_uuid, targets=targets, port_number=port_number)

            if delete_result["status"] == "success":
                # Send the success result
                if self.ip_regex.match(targets[0]):
                    await self.socketio.emit(
                        'ips:updated', {
                            'status': 'success',
                            'project_uuid': project_uuid,
                            'updated_ips': targets
                        },
                        namespace='/ips'
                    )
                else:
                    await self.socketio.emit(
                        'hosts:updated', {
                            'status': 'success',
                            'project_uuid': project_uuid,
                            'updated_hosts': targets
                        },
                        namespace='/hosts'
                    )

                await send_notification(
                    self.socketio,
                    "success",
                    "Creds deleted",
                    "Deleted creds for {}".format(targets),
                    project_uuid=project_uuid
                )
            else:
                await send_notification(
                    self.socketio,
                    "error",
                    "Error on creds delete",
                    "Error while deleting creds {}".format(project_uuid),
                    project_uuid=project_uuid
                )
