""" Module keeps class of scope handlers """
import asyncio
from netaddr import IPNetwork


PACKET_SIZE = 1000

class ScopeHandlers(object):
    """ Registers all handlers related to scopes """

    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

    def register_handlers(self):
        """ Register all handlers """

        @self.socketio.on('scopes:part:get', namespace='/scopes')
        async def _cb_handle_scopes_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = msg.get('project_uuid', None)
            ip_page = msg.get('ip_page', 0)
            host_page = msg.get('host_page', 0)
            ip_page_size = msg.get('ip_page_size', 12)
            host_page_size = msg.get('host_page_size', 12)
            filters = msg.get('filters')

            await self.send_scopes_back(filters, sio, project_uuid, host_page, host_page_size, ip_page, ip_page_size)

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
                    'scopes:create', {
                        'status': 'error',
                        'project_uuid': project_uuid,
                        'text': error_text
                    },
                    namespace='/scopes'
                )

            else:
                # Send the scope back
                await self.socketio.emit(
                    'scopes:create', {
                        'status': 'success',
                        'project_uuid': project_uuid,
                        'new_scopes': new_scopes
                    },
                    namespace='/scopes'
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
                await self.socketio.emit(
                    'scopes:delete', {'status': 'success',
                                      '_id': scope_id,
                                      'project_uuid': project_uuid},
                    namespace='/scopes'
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

        @self.socketio.on('scopes:resolve', namespace='/scopes')
        async def _cb_handle_scope_resolve(sio, msg):
            """ On receive, resolve the needed scope """
            scopes_ids = msg['scopes_ids']
            project_uuid = msg['project_uuid']

            await self.scope_manager.resolve_scopes(scopes_ids, project_uuid)
            # TODO: Substitute this method for the correct one
            await self.socketio.emit(
                'scopes:resolve:done', {
                    'status': 'success',
                    'project_uuid': project_uuid
                },
                namespace='/scopes'
            )

        @self.socketio.on('scopes:update', namespace='/scopes')
        async def _cb_handle_scope_update(sio, msg):
            """ Update the scope (now only used for comment). """
            scope_id = msg['scope_id']
            comment = msg['comment']
            project_uuid = msg['project_uuid']
            scope_type = msg['scope_type']

            result = self.scope_manager.update_scope(
                scope_id=scope_id, comment=comment, scope_type=scope_type
            )
            if result["status"] == "success":
                await self.socketio.emit(
                    'scopes:update:back',
                    {
                     "status": "success",
                     "scope_id": scope_id,
                     "scope_type": scope_type,
                     "comment": comment,
                     "project_uuid": project_uuid},
                    namespace='/scopes'
                )
            else:
                result['project_uuid'] = project_uuid
                await self.socketio.emit(
                    'scopes:update:back',
                    result,
                    namespace='/scopes'
                )

    async def send_scopes_back(self, filters, sio=None, project_uuid=None, host_page=0, host_page_size=12, ip_page=0, ip_page_size=12):
        """ Collects all relative hosts and ips from the manager and sends them back """
        ips = self.scope_manager.get_ips(filters, project_uuid, ip_page, ip_page_size)
        hosts = self.scope_manager.get_hosts(filters, project_uuid, host_page, host_page_size)

        if sio is None:
            await self.socketio.emit(
                'scopes:part:set', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'ips': {
                        'page': ip_page,
                        'page_size': ip_page_size,
                        'data': ips['ips'],
                        'total_db_ips': ips['total_db_ips']
                    },
                    'hosts': {
                        'page': host_page,
                        'page_size': host_page_size,
                        'data': hosts['hosts'],
                        'total_db_hosts': hosts['total_db_hosts']
                    }
                },
                namespace='/scopes'
            )
        else:
            await self.socketio.emit(
                'scopes:part:set', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'ips': {
                        'page': ip_page,
                        'page_size': ip_page_size,
                        'data': ips['ips'],
                        'total_db_ips': ips['total_db_ips']
                    },
                    'hosts': {
                        'page': host_page,
                        'page_size': host_page_size,
                        'data': hosts['hosts'],
                        'total_db_hosts': hosts['total_db_hosts']
                    }
                },
                room=sio,
                namespace='/scopes'
            )
