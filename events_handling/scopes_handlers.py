import json
from flask_socketio import emit

from managers import ScopeManager


def initialize(socketio):
    scope_manager = ScopeManager()

    @socketio.on('scopes:all:get', namespace='/black')
    def handle_custom_event():
        """ When received this message, send back all the scopes """
        emit('scopes:all:get:back', json.dumps(scope_manager.get_scopes(), namespace='/black', broadcast=True))


    @socketio.on('scopes:create', namespace='/black')
    def handle_scope_creation(msg):
        """ When received this message, create a new scope """
        scopes = msg['scopes']
        project_name = msg['project_name']

        new_scopes = []

        error_found = False
        error_text = ""

        for scope in scopes:
            # Create new scope (and register it)
            if scope['type'] == 'hostname':
                create_result = scope_manager.create_scope(scope['target'], None, project_name)
            elif scope['type'] == 'ip_address':
                create_result = scope_manager.create_scope(None, scope['target'], project_name)
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
            emit('scopes:create:' + project_name, json.dumps({
                'status': 'error',
                'text': error_text
            }), namespace='/black', broadcast=True)

        else:
            # Send the scope back
            emit('scopes:create:' + project_name, json.dumps({
                'status': 'success',
                'new_scopes': new_scopes
            }), namespace='/black', broadcast=True)


    @socketio.on('scopes:delete:scope_id', namespace='/black')
    def handle_scope_deletiong(msg):
        """ When received this message, delete the scope """
        scope_id = msg

        # Delete new scope (and register it)
        delete_result = scope_manager.delete_scope(scope_id=scope_id)

        if delete_result["status"] == "success":
            # Send the success result
            emit('scopes:delete:scope_id:' + scope_id, json.dumps({
                'status': 'success'
            }), namespace='/black', broadcast=True)

        else:
            # Error occured
            emit('scopes:delete:scope_id:' + scope_id, json.dumps({
                'status': 'error',
                'text': delete_result["text"]
            }), namespace='/black', broadcast=True)
