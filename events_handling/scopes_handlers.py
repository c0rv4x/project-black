import asyncio
from netaddr import IPNetwork

from events_handling.notifications_spawner import send_notification


class IPHandlers(object):

    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

        self.register_handlers()

    def register_handlers(self):
        @self.socketio.on('ips:part:get', namespace='/ips')
        async def _cb_handle_scopes_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = int(msg.get('project_uuid', None))
            ip_page = msg.get('ip_page', 0)
            ip_page_size = msg.get('ip_page_size', 12)
            ip_filters = msg.get('ip_filters')

            await self.send_ips_back(
                ip_filters, sio, project_uuid, ip_page, ip_page_size
            )

        @self.socketio.on('ips:single:get', namespace='/ips')
        async def _cb_handle_scope_single_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = int(msg.get('project_uuid', None))
            ip_address = msg.get('ip_address')

            await self.send_ips_back({'ip': [ip_address]}, sio, project_uuid)

        @self.socketio.on('ips:update', namespace='/ips')
        async def _cb_handle_scope_update(sio, msg):
            """ Update the scope (now only used for comment). """
            ip_id = msg['ip_id']
            comment = msg['comment']
            project_uuid = msg['project_uuid']

            result = self.scope_manager.update_scope(
                scope_id=ip_id, comment=comment, scope_type='ip_address'
            )

            target = result['target']

            if result["status"] == "success":
                await self.socketio.emit(
                    'ips:update:back',
                    {
                        "status": "success",
                        "ip_id": ip_id,
                        "comment": comment,
                        "project_uuid": project_uuid
                    },
                    namespace='/ips'
                )

                await send_notification(
                    self.socketio,
                    "success",
                    "Scope updated",
                    "Comment for {} has been updated".format(
                        target
                    ),
                    project_uuid=project_uuid
                )
            else:
                result['project_uuid'] = project_uuid

                await self.socketio.emit(
                    'ips:update:back',
                    result,
                    namespace='/ips'
                )

                await send_notification(
                    self.socketio,
                    "error",
                    "Scope not updated",
                    "Comment for {} updated with an error".format(
                        target
                    ),
                    project_uuid=project_uuid
                )

        @self.socketio.on('ips:get:tasks', namespace='/ips')
        async def _cb_handle_tasks_get(sio, msg):
            """ When received this message, send back all the tasks """
            project_uuid = int(msg.get('project_uuid', None))
            ips = msg.get('ips', None)

            await self.send_tasks_back_filtered(project_uuid, ips=ips)

    async def send_tasks_back_filtered(self, project_uuid, ips=None, hosts=None):
        """ Grab tasks data for scopes and send them back to client """
        get_result = self.scope_manager.get_tasks_filtered(
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

    async def send_ips_back(
        self, filters, sio=None,
        project_uuid=None, ip_page=0, ip_page_size=12
    ):
        """ Collects all relative hosts and ips from
        the manager and sends them back """

        ips = self.scope_manager.get_ips(
            filters, project_uuid, ip_page, ip_page_size)

        if sio is None:
            await self.socketio.emit(
                'ips:part:set', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'ips': {
                        'page': ip_page,
                        'page_size': ip_page_size,
                        'data': ips['ips'],
                        'selected_ips': ips['selected_ips'],
                        'total_db_ips': ips['total_db_ips']
                    }
                },
                namespace='/ips'
            )
        else:
            await self.socketio.emit(
                'ips:part:set', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'ips': {
                        'page': ip_page,
                        'page_size': ip_page_size,
                        'data': ips['ips'],
                        'selected_ips': ips['selected_ips'],
                        'total_db_ips': ips['total_db_ips']
                    }
                },
                room=sio,
                namespace='/ips'
            )


class HostHandlers(object):

    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

    def register_handlers(self):
        @self.socketio.on('hosts:part:get', namespace='/hosts')
        async def _cb_handle_scopes_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = int(msg.get('project_uuid', None))
            host_page = msg.get('host_page', 0)
            host_page_size = msg.get('host_page_size', 12)
            host_filters = msg.get('host_filters', {})

            await self.send_hosts_back(
                host_filters, sio, project_uuid, host_page, host_page_size)

        @self.socketio.on('hosts:single:get', namespace='/hosts')
        async def _cb_handle_single_scope_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = int(msg.get('project_uuid', None))
            hostname = msg.get('hostname')

            await self.send_single_host_back(hostname, project_uuid, sio)

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

            result = self.scope_manager.update_scope(
                scope_id=host_id, comment=comment, scope_type='host'
            )
            target = result['target']

            if result["status"] == "success":
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
                result['project_uuid'] = project_uuid
                await self.socketio.emit(
                    'hosts:update:back',
                    result,
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
        get_result = self.scope_manager.get_tasks_filtered(
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

    async def send_single_host_back(
        self, host, project_uuid=None, sio=None
    ):
        """ Applies a filter to get only one host from the db """
        await self.send_hosts_back({'host': [host]}, sio, project_uuid)

    async def send_hosts_back(
        self, filters, sio=None, project_uuid=None,
        host_page=0, host_page_size=12
    ):
        """ Collects all relative hosts and ips from
        the manager and sends them back """

        hosts = self.scope_manager.get_hosts(
            filters, project_uuid, host_page, host_page_size)
        if sio is None:
            await self.socketio.emit(
                'hosts:part:set', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'hosts': {
                        'page': host_page,
                        'page_size': host_page_size,
                        'data': hosts['hosts'],
                        'total_db_hosts': hosts['total_db_hosts'],
                        'selected_hosts': hosts['selected_hosts']
                    }
                },
                namespace='/hosts'
            )
        else:
            await self.socketio.emit(
                'hosts:part:set', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'hosts': {
                        'page': host_page,
                        'page_size': host_page_size,
                        'data': hosts['hosts'],
                        'total_db_hosts': hosts['total_db_hosts'],
                        'selected_hosts': hosts['selected_hosts']
                    }
                },
                room=sio,
                namespace='/hosts'
            )


class ScopeHandlers(object):
    """ Registers all handlers related to scopes """

    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

    def register_handlers(self):
        """ Register all handlers """

        ip = IPHandlers(self.socketio, self.scope_manager)
        ip.register_handlers()
        host = HostHandlers(self.socketio, self.scope_manager)
        host.register_handlers()

        @self.socketio.on('scopes:create', namespace='/scopes')
        async def _cb_handle_scope_create(sio, msg):
            """ When received this message, create a new scope """
            scopes = msg['scopes']
            project_uuid = msg['project_uuid']

            new_ips = []
            new_hosts = []

            error_found = False
            error_text = ""

            for scope in scopes:
                added = False
                # Create newly added scope
                if scope['type'] == 'hostname':
                    create_result = self.scope_manager.create_host(
                        scope['target'], project_uuid
                    )

                    if create_result["status"] == "success":
                        new_hosts.append(create_result["new_scope"].dict())
                    else:
                        error_found = True
                        new_err = create_result["text"]

                        if new_err not in error_text:
                            error_text += new_err

                elif scope['type'] == 'ip_address':
                    create_result = self.scope_manager.create_ip(
                        scope['target'], project_uuid
                    )

                    if create_result["status"] == "success":
                        new_ips.append(create_result["new_scope"].dict())
                    else:
                        error_found = True
                        new_err = create_result["text"]

                        if new_err not in error_text:
                            error_text += new_err

                elif scope['type'] == 'network':
                    ips = IPNetwork(scope['target'])

                    create_result = self.scope_manager.create_batch_ips(
                        list(map(str, ips)), project_uuid
                    )

                    if create_result["status"] == "success":
                        new_ips += create_result["new_scopes"]
                    else:
                        error_found = True
                        new_err = create_result["text"]

                        if new_err not in error_text:
                            error_text += new_err
                else:
                    create_result = {
                        "status": 'error',
                        "text": "Something bad was sent upon creating scope"
                    }

            if error_found:
                await send_notification(
                    self.socketio,
                    "error",
                    "Error while adding scopes",
                    "Error while adding scopes: {}".format(
                        error_text
                    ),
                    project_uuid=project_uuid
                )

                await self.socketio.emit(
                    'scopes:create', {
                        'status': 'error',
                        'project_uuid': project_uuid
                    },
                    namespace='/scopes'
                )
                
            else:
                await self.socketio.emit(
                    'scopes:create', {
                        'status': 'success',
                        'project_uuid': project_uuid
                    },
                    namespace='/scopes'
                )

            # Send the scope back
            if new_hosts:
                await self.socketio.emit(
                    'hosts:create', {
                        'status': 'success',
                        'project_uuid': project_uuid,
                        'new_hosts': new_hosts
                    },
                    namespace='/hosts'
                )

                await send_notification(
                    self.socketio,
                    "success",
                    "Hosts added",
                    "Added {} hosts".format(
                        len(new_hosts)
                    ),
                    project_uuid=project_uuid
                )

            if new_ips:
                await self.socketio.emit(
                    'ips:create', {
                        'status': 'success',
                        'project_uuid': project_uuid,
                        'new_ips': new_ips
                    },
                    namespace='/ips'
                )

                await send_notification(
                    self.socketio,
                    "success",
                    "IPs added",
                    "Added {} ips".format(
                        len(new_ips)
                    ),
                    project_uuid=project_uuid
                )

        @self.socketio.on('scopes:delete:scope_id', namespace='/scopes')
        async def _cb_handle_scope_delete(sio, msg):
            """ When received this message, delete the scope """
            scope_id = msg['scope_id']
            project_uuid = msg['project_uuid']
            scope_type = msg['scope_type']

            # Delete new scope (and register it)
            delete_result = self.scope_manager.delete_scope(
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
