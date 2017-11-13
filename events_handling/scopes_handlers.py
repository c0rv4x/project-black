""" Module keeps class of scope handlers """
import uuid
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

        @self.socketio.on('scopes:all:get', namespace='/scopes')
        async def _cb_handle_scopes_get(sio, msg):
            """ When received this message, send back all the scopes """
            project_uuid = msg.get('project_uuid', None)
            await self.send_scopes_back(project_uuid)

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
                    broadcast=True,
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
                    broadcast=True,
                    namespace='/scopes'
                )

        @self.socketio.on('scopes:delete:scope_id', namespace='/scopes')
        async def _cb_handle_scope_delete(sio, msg):
            """ When received this message, delete the scope """
            scope_id = msg['scope_id']
            project_uuid = msg['project_uuid']

            # Delete new scope (and register it)
            delete_result = self.scope_manager.delete_scope(scope_id=scope_id,
                                                            project_uuid=project_uuid)

            if delete_result["status"] == "success":
                # Send the success result
                await self.socketio.emit(
                    'scopes:delete', {'status': 'success',
                                      '_id': scope_id,
                                      'project_uuid': project_uuid},
                    broadcast=True,
                    namespace='/scopes'
                )

                await self.socketio.emit(
                    'scopes:all:get:back', {
                        'status': 'success',
                        'ips': self.scope_manager.get_ips(project_uuid),
                        'hosts': self.scope_manager.get_hosts(project_uuid),
                        'project_uuid': project_uuid
                    },
                    broadcast=True,
                    namespace='/scopes'
                )
            else:
                # Error occured
                await self.socketio.emit(
                    'scopes:delete',
                    {'status': 'error',
                     'text': delete_result["text"],
                     'project_uuid': project_uuid},
                    broadcast=True,
                    namespace='/scopes'
                )

        @self.socketio.on('scopes:resolve', namespace='/scopes')
        async def _cb_handle_scope_resolve(sio, msg):
            """ On receive, resolve the needed scope """
            scopes_ids = msg['scopes_ids']
            project_uuid = msg['project_uuid']

            await self.scope_manager.resolve_scopes(scopes_ids, project_uuid)
            print(
                "Sending after resolve:",
                self.scope_manager.get_ips(project_uuid),
                self.scope_manager.get_hosts(project_uuid)
            )
            await self.socketio.emit(
                'scopes:all:get:back', {
                    'status': 'success',
                    'ips': self.scope_manager.get_ips(project_uuid),
                    'hosts': self.scope_manager.get_hosts(project_uuid),
                    'project_uuid': project_uuid
                },
                broadcast=True,
                namespace='/scopes'
            )

        @self.socketio.on('scopes:update', namespace='/scopes')
        async def _cb_handle_scope_update(sio, msg):
            """ Update the scope (now only used for comment). """
            scope_id = msg['scope_id']
            comment = msg['comment']
            project_uuid = msg['project_uuid']

            result = self.scope_manager.update_scope(
                scope_id=scope_id, comment=comment
            )
            if result["status"] == "success":
                updated_scope = result["updated_scope"]

                await self.socketio.emit(
                    'scopes:update:back',
                    {
                     "status": "success",
                     "updated_scope": updated_scope,
                     "project_uuid": project_uuid},
                    broadcast=True,
                    namespace='/scopes'
                )
            else:
                result['project_uuid'] = project_uuid
                await self.socketio.emit(
                    'scopes:update:back',
                    result,
                    broadcast=True,
                    namespace='/scopes'
                )

        @self.socketio.on('scopes:update:comment', namespace='/scopes')
        async def _cb_handle_scope_update(sio, msg):
            """ Update the scope (now only used for comment). """
            scope_id = msg['scope_id']
            comment = msg['comment']
            project_uuid = msg['project_uuid']

            result = self.scope_manager.update_scope(
                scope_id=scope_id, comment=comment
            )
            if result["status"] == "success":
                updated_scope = result["updated_scope"]

                await self.socketio.emit(
                    'scopes:update:comment:back',
                    {
                     "status": "success",
                     "updated_scope": updated_scope,
                     "project_uuid": project_uuid},
                    broadcast=True,
                    namespace='/scopes'
                )
            else:
                result['project_uuid'] = project_uuid
                await self.socketio.emit(
                    'scopes:update:comment:back',
                    result,
                    broadcast=True,
                    namespace='/scopes'
                )

    async def send_scopes_back(self, project_uuid=None, broadcast=False):
        """ Collects all relative hosts and ips from the manager and sends them back """
        ips = self.scope_manager.get_ips(project_uuid)
        hosts = self.scope_manager.get_hosts(project_uuid)

        await self.send_ips_hosts(ips, hosts, project_uuid, str(uuid.uuid4()), broadcast)

        # for i in range(0, max(len(ips) // PACKET_SIZE, len(hosts) // PACKET_SIZE) + 1):

    async def send_ips_hosts(self, ips, hosts, project_uuid, transaction_id, broadcast=False, i=0):
        if i == (len(ips) // PACKET_SIZE) + 1:
            return

        loop = asyncio.get_event_loop()
        await self.send_scopes_packet(ips[i * PACKET_SIZE : (i + 1) * PACKET_SIZE],
                                      hosts[i * PACKET_SIZE : (i + 1) * PACKET_SIZE],
                                      project_uuid,
                                      transaction_id,
                                      broadcast,
                                      lambda: loop.create_task(self.send_ips_hosts(ips, hosts, project_uuid, transaction_id, broadcast, i + 1)),
                                      i)

    async def send_scopes_packet(self, ips, hosts, project_uuid, transaction_id, broadcast, callback, page):
        print("Sending scope #{}".format(page))
        await self.socketio.emit(
            'scopes:all:get:back', {
                'status': 'success',
                'project_uuid': project_uuid,
                'ips': ips,
                'page': page,
                'transaction_id': transaction_id,
                'hosts': hosts
            },
            broadcast=broadcast,
            namespace='/scopes',
            callback=callback
        )
