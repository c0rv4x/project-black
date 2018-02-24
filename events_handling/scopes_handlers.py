""" Module keeps class of scope handlers """
import asyncio
from netaddr import IPNetwork


class IPHandlers(object):

    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

    def register_handlers(self):
        @self.socketio.on('ips:part:get', namespace='/ips')
        async def _cb_handle_scopes_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = int(msg.get('project_uuid', None))
            ip_page = msg.get('ip_page', 0)
            ip_page_size = msg.get('ip_page_size', 12)
            ip_filters = msg.get('ip_filters')

            await self.send_ips_back(ip_filters, sio, project_uuid, ip_page, ip_page_size)

        @self.socketio.on('ips:single:get', namespace='/ips')
        async def _cb_handle_scope_single_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = int(msg.get('project_uuid', None))
            ip_address = msg.get('ip_address')

            print("Getting single ip", ip_address)

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
            if result["status"] == "success":
                await self.socketio.emit(
                    'ips:update:back',
                    {
                     "status": "success",
                     "ip_id": ip_id,
                     "comment": comment,
                     "project_uuid": project_uuid},
                    namespace='/ips'
                )
            else:
                result['project_uuid'] = project_uuid
                await self.socketio.emit(
                    'ips:update:back',
                    result,
                    namespace='/ips'
                )

    async def send_ips_back(self, filters, sio=None, project_uuid=None, ip_page=0, ip_page_size=12):
        """ Collects all relative hosts and ips from the manager and sends them back """
        ips = self.scope_manager.get_ips(filters, project_uuid, ip_page, ip_page_size)

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

            await self.send_hosts_back(host_filters, sio, project_uuid, host_page, host_page_size)

        @self.socketio.on('hosts:single:get', namespace='/hosts')
        async def _cb_handle_single_scope_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = int(msg.get('project_uuid', None))
            hostname = msg.get('hostname')

            await self.send_hosts_back({'host': [hostname]}, sio, project_uuid)

        @self.socketio.on('hosts:resolve', namespace='/hosts')
        async def _cb_handle_scope_resolve(sio, msg):
            """ On receive, resolve the needed scope """
            hosts_ids = msg['hosts_ids']
            project_uuid = msg['project_uuid']

            await self.scope_manager.resolve_scopes(hosts_ids, project_uuid)

            await self.socketio.emit(
                'hosts:resolve:done', {
                    'status': 'success',
                    'project_uuid': project_uuid
                },
                namespace='/hosts'
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
            else:
                result['project_uuid'] = project_uuid
                await self.socketio.emit(
                    'hosts:update:back',
                    result,
                    namespace='/hosts'
                )

    async def send_hosts_back(self, filters, sio=None, project_uuid=None, host_page=0, host_page_size=12):
        """ Collects all relative hosts and ips from the manager and sends them back """
        hosts = self.scope_manager.get_hosts(filters, project_uuid, host_page, host_page_size)
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

            new_scopes = []

            error_found = False
            error_text = ""

            for scope in scopes:
                added = False
                # Create newly added scope
                if scope['type'] == 'hostname':
                    create_result = self.scope_manager.create_host(
                        scope['target'], project_uuid
                    )
                elif scope['type'] == 'ip_address':
                    create_result = self.scope_manager.create_ip(
                        scope['target'], project_uuid
                    )
                elif scope['type'] == 'network':
                    ips = IPNetwork(scope['target'])

                    create_result = self.scope_manager.create_batch_ips(
                        list(map(str, ips)), project_uuid
                    )

                    added = True
                    new_scopes = create_result["new_scopes"]

                    # for ip_address in ips:
                    #     print("Adding ip {}".format(ip_address))
                    #     create_result = self.scope_manager.create_ip(
                    #         str(ip_address), project_uuid
                    #     )

                    #     if create_result["status"] == "success":
                    #         new_scope = create_result["new_scope"]

                    #         if new_scope:
                    #             added = True
                    #             new_scopes.append(new_scope)
                else:
                    create_result = {
                        "status": 'error',
                        "text": "Something bad was sent upon creating scope"
                    }

                if not added and create_result["status"] == "success":
                    new_scope = create_result["new_scope"]

                    if new_scope:
                        new_scopes.append(new_scope)

                elif create_result["status"] == "error":
                    error_found = True
                    new_err = create_result["text"]

                    if new_err not in error_text:
                        error_text += new_err

            if error_found:
                await self.socketio.emit(
                    'ips:create', {
                        'status': 'error',
                        'project_uuid': project_uuid,
                        'text': error_text
                    },
                    namespace='/ips'
                )
                await self.socketio.emit(
                    'hosts:create', {
                        'status': 'error',
                        'project_uuid': project_uuid,
                        'text': error_text
                    },
                    namespace='/hosts'
                )                

            else:
                # Send the scope back

                if scope['type'] == 'hostname':
                    await self.socketio.emit(
                        'hosts:create', {
                            'status': 'success',
                            'project_uuid': project_uuid,
                            'new_hosts': new_scopes[0:50]
                        },
                        namespace='/hosts'
                    )  
                
                else:
                    await self.socketio.emit(
                        'ips:create', {
                            'status': 'success',
                            'project_uuid': project_uuid,
                            'new_ips': new_scopes[0:50]
                        },
                        namespace='/ips'
                    )

        @self.socketio.on('scopes:delete:scope_id', namespace='/scopes')
        async def _cb_handle_scope_delete(sio, msg):
            """ When received this message, delete the scope """
            scope_id = msg['scope_id']
            project_uuid = msg['project_uuid']
            scope_type = msg['scope_type']

            # Delete new scope (and register it)
            delete_result = self.scope_manager.delete_scope(scope_id=scope_id, scope_type=scope_type)

            if delete_result["status"] == "success":
                # Send the success result
                if scope_type == 'ip_address':
                    await self.socketio.emit(
                        'ips:delete', {'status': 'success',
                                          '_id': scope_id,
                                          'project_uuid': project_uuid},
                        namespace='/ips'
                    )
                else:
                    await self.socketio.emit(
                        'hosts:delete', {'status': 'success',
                                          '_id': scope_id,
                                          'project_uuid': project_uuid},
                        namespace='/hosts'
                    )                    
            else:
                # Error occured
                await self.socketio.emit(
                    'scopes:delete',
                    {'status': 'error',
                     'text': delete_result["text"],
                     'project_uuid': project_uuid},
                    room=sio,
                    namespace='/scopes'
                )
