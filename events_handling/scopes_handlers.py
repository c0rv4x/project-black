import asyncio
from netaddr import IPNetwork

from events_handling.notifications_spawner import send_notification


class IPHandlers(object):

    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('ips:get:tasks', namespace='/ips')
        async def _cb_handle_tasks_get(sio, msg):
            """ When received this message, send back all the tasks """
            project_uuid = int(msg.get('project_uuid', None))
            ips = msg.get('ips', None)

            await self.send_tasks_back_filtered(project_uuid, ips=ips)

    async def send_tasks_back_filtered(self, project_uuid, ips=None, hosts=None):
        """ Grab tasks data for scopes and send them back to client """
        get_result = await self.scope_manager.get_tasks_filtered(
            project_uuid,
            ips=ips,
            hosts=hosts
        )

        if get_result["status"] == "success":
            await self.socketio.emit(
                'ips:get:tasks:back',
                {
                    "status": "success",
                    "project_uuid": project_uuid,
                    "active": get_result["active"],
                    "finished": get_result["finished"]
                },
                namespace='/ips'
            )
        else:
            await self.socketio.emit(
                'ips:get:tasks:back',
                get_result,
                namespace='/ips'
            )

class HostHandlers(object):

    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('hosts:resolve', namespace='/hosts')
        async def _cb_handle_scope_resolve(sio, msg):
            """ On receive, resolve the needed scope """
            hosts_ids = msg['hosts_ids']
            project_uuid = msg['project_uuid']

            total_ips, new_ips = await self.scope_manager.resolve_scopes(hosts_ids, project_uuid)

            await self.socketio.emit(
                'hosts:resolve:done', {
                    'status': 'success',
                    'project_uuid': project_uuid
                },
                namespace='/hosts'
            )

            await send_notification(
                self.socketio,
                "success",
                "Hosts resolved",
                "Hosts resolved. Found {} ips, {} new".format(
                    total_ips, new_ips
                ),
                project_uuid=project_uuid
            )            

        @self.socketio.on('hosts:update', namespace='/hosts')
        async def _cb_handle_scope_update(sio, msg):
            """ Update the scope (now only used for comment). """
            host_id = msg['host_id']
            comment = msg['comment']
            project_uuid = msg['project_uuid']

            update_result = await self.scope_manager.update_scope(
                scope_id=host_id, comment=comment, scope_type='host'
            )
            target = update_result['target']

            if update_result["status"] == "success":
                await self.socketio.emit(
                    'hosts:update:back',
                    {
                     "status": "success",
                     "host_id": host_id,
                     "comment": comment,
                     "project_uuid": project_uuid},
                    namespace='/hosts'
                )

                await send_notification(
                    self.socketio,
                    "success",
                    "Host updated",
                    "Comment for {} updated".format(
                        target
                    ),
                    project_uuid=project_uuid
                )
            else:
                update_result['project_uuid'] = project_uuid
                await self.socketio.emit(
                    'hosts:update:back',
                    update_result,
                    namespace='/hosts'
                )

                await send_notification(
                    self.socketio,
                    "error",
                    "Host not updated",
                    "Comment for {} updated with an error".format(
                        target
                    ),
                    project_uuid=project_uuid
                )

        @self.socketio.on('hosts:get:tasks', namespace='/hosts')
        async def _cb_handle_tasks_get(sio, msg):
            """ When received this message, send back all the tasks """
            project_uuid = int(msg.get('project_uuid', None))
            hosts = msg.get('hosts', None)

            await self.send_tasks_back_filtered(project_uuid, hosts=hosts)


    async def send_tasks_back_filtered(self, project_uuid, ips=None, hosts=None):
        """ Grab tasks data for scopes and send them back to client """
        get_result = await self.scope_manager.get_tasks_filtered(
            project_uuid,
            ips=ips,
            hosts=hosts
        )

        if get_result["status"] == "success":
            await self.socketio.emit(
                'hosts:get:tasks:back',
                {
                    "status": "success",
                    "project_uuid": project_uuid,
                    "active": get_result["active"],
                    "finished": get_result["finished"]
                },
                namespace='/hosts'
            )
        else:
            await self.socketio.emit(
                'hosts:get:tasks:back',
                get_result,
                namespace='/hosts'
            )


class ScopeHandlers(object):
    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

        self.register_handlers()

    def register_handlers(self):
        IPHandlers(self.socketio, self.scope_manager)
        HostHandlers(self.socketio, self.scope_manager)

        @self.socketio.on('scopes:delete:scope_id', namespace='/scopes')
        async def _cb_handle_scope_delete(sio, msg):
            """ When received this message, delete the scope """
            scope_id = msg['scope_id']
            project_uuid = msg['project_uuid']
            scope_type = msg['scope_type']

            # Delete new scope (and register it)
            delete_result = await self.scope_manager.delete_scope(
                scope_id=scope_id, scope_type=scope_type)

            if delete_result["status"] == "success":
                # Send the success result
                if scope_type == 'ip_address':
                    await self.socketio.emit(
                        'ips:delete', {
                            'status': 'success',
                            '_id': scope_id,
                            'project_uuid': project_uuid
                        },
                        namespace='/ips'
                    )

                    await send_notification(
                        self.socketio,
                        "success",
                        "IP deleted",
                        "Deleted {}".format(
                            delete_result['target']
                        ),
                        project_uuid=project_uuid
                    )
                else:
                    await self.socketio.emit(
                        'hosts:delete', {
                            'status': 'success',
                            '_id': scope_id,
                            'project_uuid': project_uuid
                        },
                        namespace='/hosts'
                    )

                    await send_notification(
                        self.socketio,
                        "success",
                        "Host deleted",
                        "Deleted {}".format(
                            delete_result['target']
                        ),
                        project_uuid=project_uuid
                    )
            else:
                # Error occured
                await self.socketio.emit(
                    'scopes:delete', {
                        'status': 'error',
                        'text': delete_result["text"],
                        'project_uuid': project_uuid
                    },
                    room=sio,
                    namespace='/scopes'
                )

                await send_notification(
                    self.socketio,
                    "error",
                    "IP not deleted",
                    "Error while deleting {}".format(
                        delete_result['target']
                    ),
                    project_uuid=project_uuid
                )
