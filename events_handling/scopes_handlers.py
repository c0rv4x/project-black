from netaddr import IPNetwork
from flask_socketio import emit



class ScopeHandlers(object):
    def __init__(self, socketio, scope_manager):
        self.socketio = socketio
        self.scope_manager = scope_manager

        @socketio.on('scopes:all:get', namespace='/scopes')
        def handle_custom_event(msg):
            """ When received this message, send back all the scopes """
            project_uuid = msg.get('project_uuid', None)
            self.send_scopes_back(project_uuid)

        @socketio.on('scopes:create', namespace='/scopes')
        def handle_scope_creation(msg):
            """ When received this message, create a new scope """
            scopes = msg['scopes']
            project_uuid = msg['project_uuid']

            new_scopes = []

            error_found = False
            error_text = ""

            for scope in scopes:
                added = False
                # Create new scope (and register it)
                if scope['type'] == 'hostname':
                    create_result = self.scope_manager.create_scope(None, scope['target'], project_uuid)
                elif scope['type'] == 'ip_address':
                    create_result = self.scope_manager.create_scope(scope['target'], None, project_uuid)
                elif scope['type'] == 'network':
                    ips = IPNetwork(scope['target'])

                    for ip_address in ips:
                        create_result = self.scope_manager.create_scope(str(ip_address), None, project_uuid)

                        if create_result["status"] == "success":
                            new_scope = create_result["new_scope"]

                            if new_scope:
                                added = True
                                new_scopes.append(new_scope)
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
                self.socketio.emit('scopes:create', {
                    'status': 'error',
                    'project_uuid': project_uuid,
                    'text': error_text
                }, broadcast=True, namespace='/scopes')

            else:
                # Send the scope back
                self.socketio.emit('scopes:create', {
                    'status': 'success',
                    'project_uuid': project_uuid,
                    'new_scopes': new_scopes
                }, broadcast=True, namespace='/scopes')


        @socketio.on('scopes:delete:scope_id', namespace='/scopes')
        def handle_scope_deletioning(msg):
            """ When received this message, delete the scope """
            scope_id = msg['scope_id']

            # Delete new scope (and register it)
            delete_result = self.scope_manager.delete_scope(scope_id=scope_id)

            if delete_result["status"] == "success":
                # Send the success result
                self.socketio.emit('scopes:delete', {
                    'status': 'success',
                    '_id': scope_id
                }, broadcast=True, namespace='/scopes')

                self.socketio.emit('scopes:all:get:back', {
                    'status' : 'success',
                    'ips' : self.scope_manager.get_ips(),
                    'hosts': self.scope_manager.get_hosts()
                }, broadcast=True, namespace='/scopes')
            else:
                # Error occured
                self.socketio.emit('scopes:delete', {
                    'status': 'error',
                    'text': delete_result["text"]
                }, broadcast=True, namespace='/scopes')

        @socketio.on('scopes:resolve', namespace='/scopes')
        def handle_scopes_resolver(msg):
            """ On receive, resolve the needed scope """
            scopes_ids = msg['scopes_ids']
            project_uuid = msg['project_uuid']

            self.scope_manager.resolve_scopes(scopes_ids, project_uuid)
            print("Sending after resolve:", self.scope_manager.get_ips(project_uuid), self.scope_manager.get_hosts(project_uuid))
            self.socketio.emit('scopes:all:get:back', {
                'status' : 'success',
                'ips' : self.scope_manager.get_ips(project_uuid),
                'hosts': self.scope_manager.get_hosts(project_uuid)
            }, broadcast=True, namespace='/scopes')

        @socketio.on('scopes:update', namespace='/scopes')
        def handle_scope_update(msg): 
            """ Update the scope (now only used for comment). """
            scope_id = msg['scope_id']
            comment = msg['comment']

            result = self.scope_manager.update_scope(scope_id=scope_id, comment=comment)
            if result["status"] == "success":
                updated_scope = result["updated_scope"]

                self.socketio.emit('scopes:update:back', {
                    "status": "success",
                    "updated_scope": updated_scope
                }, broadcast=True, namespace='/scopes')
            else:
                self.socketio.emit('scopes:update:back', result, broadcast=True, namespace='/scopes')

    def send_scopes_back(self, project_uuid):
        self.socketio.emit('scopes:all:get:back', {
            'status' : 'success',
            'project_uuid': project_uuid,
            'ips' : self.scope_manager.get_ips(project_uuid, force_update=True),
            'hosts': self.scope_manager.get_hosts(project_uuid)
        }, broadcast=True, namespace='/scopes')
