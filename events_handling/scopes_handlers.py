from flask_socketio import emit

from managers import ScopeManager


def initialize(socketio):
    scope_manager = ScopeManager()

    @socketio.on('scopes:all:get')
    def handle_custom_event():
        """ When received this message, send back all the scopes """
        socketio.emit('scopes:all:get:back', {
            'status' : 'success',
            'scopes' :scope_manager.get_scopes()
        }, broadcast=True)


    @socketio.on('scopes:create')
    def handle_scope_creation(msg):
        """ When received this message, create a new scope """
        scopes = msg['scopes']
        project_uuid = msg['project_uuid']

        new_scopes = []

        error_found = False
        error_text = ""

        for scope in scopes:
            # Create new scope (and register it)
            if scope['type'] == 'hostname':
                create_result = scope_manager.create_scope(scope['target'], None, project_uuid)
            elif scope['type'] == 'ip_address':
                create_result = scope_manager.create_scope(None, scope['target'], project_uuid)
            else:
                create_result = {
                    "status": 'error',
                    "text": "CIDR is not implemented yet"
                }

            if create_result["status"] == "success":
                new_scope = create_result["new_scope"]

                if new_scope:
                    new_scopes.append(new_scope)
                
            elif create_result["status"] == "error":
                error_found = True
                new_err = create_result["text"]

                if new_err not in error_text:
                    error_text += new_err

        if error_found:     
            socketio.emit('scopes:create', {
                'status': 'error',
                'project_uuid': project_uuid,
                'text': error_text
            }, broadcast=True)

        else:
            # Send the scope back
            socketio.emit('scopes:create', {
                'status': 'success',
                'project_uuid': project_uuid,
                'new_scopes': new_scopes
            }, broadcast=True)


    @socketio.on('scopes:delete:scope_id')
    def handle_scope_deletiong(msg):
        """ When received this message, delete the scope """
        scope_id = msg['scope_id']

        # Delete new scope (and register it)
        delete_result = scope_manager.delete_scope(scope_id=scope_id)

        if delete_result["status"] == "success":
            # Send the success result
            socketio.emit('scopes:delete', {
                'status': 'success',
                'scope_id': scope_id
            }, broadcast=True)

        else:
            # Error occured
            socketio.emit('scopes:delete', {
                'status': 'error',
                'text': delete_result["text"]
            }, broadcast=True)

    @socketio.on('scopes:resolve')
    def handle_scopes_resolver(msg):
        """ On receive, resolve the needed scope """
        scopes_ids = msg['scopes_ids']
        project_uuid = msg['project_uuid']

        scope_manager.resolve_scopes(project_uuid, scopes_ids)
        socketio.emit('scopes:all:get:back', {
            'status' : 'success',
            'scopes' :scope_manager.get_scopes()
        }, broadcast=True)