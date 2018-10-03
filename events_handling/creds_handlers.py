""" Keeps class with creds handlers """
import re

from events_handling.notifications_spawner import send_notification


class CredHandlers(object):
    """ The name says for itself"""

    def __init__(self, socketio, creds_manager):
        self.socketio = socketio
        self.creds_manager = creds_manager

        self.ip_regex = re.compile(
            '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')

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
            """ When received this message, send back a list of creds for targets """
            project_uuid = int(msg.get('project_uuid', None))
            targets = msg.get('targets', None)

            await self.socketio.emit(
                'creds:get:back',
                self.creds_manager.get_creds(targets=targets, project_uuid=project_uuid),
                namespace='/creds',
                room=sid   
            )

        @self.socketio.on('creds:delete', namespace='/creds')
        async def _cb_handle_files_get(sid, msg):
            """ When received this message, send back count of creds for project """
            project_uuid = int(msg.get('project_uuid', None))
            targets = msg.get('targets', None)
            port_number = int(msg.get('port_number', None))

            delete_result = self.creds_manager.delete(project_uuid=project_uuid, targets=targets, port_number=port_number)

            await self.socketio.emit(
                'creds:delete:back',
                delete_result,
                namespace='/creds'
            )

            if delete_result["status"] == "success":
                await send_notification(
                    self.socketio,
                    "success",
                    "Creds deleted",
                    "Creds deleted for {}".format(targets),
                    sid=sid
                )                
            else:
                await send_notification(
                    self.socketio,
                    "error",
                    "Creds deleted with error",
                    "Erorr occured during creds being deleted for {}. {}".format(targets, delete_result["text"]),
                    sid=sid
                )      


    async def notify_on_updated_creds(self, project_uuid, updated_target=None):
        """ Send a notification that files for specific ids have changed """
        # if self.ip_regex.match(updated_target):
        await self.socketio.emit(
            'creds:updated', {
                'status': 'success',
                'project_uuid': project_uuid,
                'updated_ips': [updated_target]
            },
            namespace='/creds'
        )  
        # else:
        #     await self.socketio.emit(
        #         'hosts:updated', {
        #             'status': 'success',
        #             'project_uuid': project_uuid,
        #             'updated_hostname': updated_target
        #         },
        #         namespace='/hosts'
        #     )            