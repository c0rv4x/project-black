import uuid
import json

from flask import Flask, render_template, send_from_directory
from werkzeug.routing import BaseConverter

from flask_socketio import SocketIO, emit

from projects_handling import ProjectManager, ScopeManager


# Define Flask app and wrap it into SocketIO
app = Flask(__name__)
app.config['SECRET_KEY'] = 'KIwTR8ZUNG20UkhrXR0Pv0B9ZZigzQpVVT5KK6FA1M'
socketio = SocketIO(app)

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter

project_manager = ProjectManager()

@app.route('/')
def send_main():
    """ Simple server of statics """
    return send_from_directory('public', 'index.html')

@app.route('/<regex(".*[^\.js]"):path>')
def send_not_js(path):
    """ Simple server of statics """
    return send_from_directory('public', 'index.html')

@app.route('/<regex(".*\.js"):path>')
def send_js(path):
    """ Simple server of statics """
    return send_from_directory('public', path)



@socketio.on('projects:all:get')
def handle_custom_event():
    """ When received this message, send back all the projects """
    emit('projects:all:get:back', json.dumps(project_manager.get_projects()))


@socketio.on('projects:create')
def handle_project_creation(msg):
    """ When received this message, create a new projects """
    project_name = msg['project_name']

    # Create new project (and register it)
    addition_result = project_manager.add_new_project(project_name)

    if addition_result["status"] == "success":
        # Send the project back
        emit('projects:create:' + project_name, json.dumps({
            'status': 'success',
            'newProject': addition_result["new_project"]
        }))


    else:
        # Error occured
        emit('projects:create:' + project_name, json.dumps({
            'status': 'error',
            'text': addition_result["text"]
        }))


@socketio.on('projects:delete:project_uuid')
def handle_project_creation(msg):
    """ When received this message, delete the project """
    project_uuid = msg

    # Delete new project (and register it)
    delete_result = project_manager.delete_project(project_uuid=project_uuid)

    if delete_result["status"] == "success":
        # Send the success result
        emit('projects:delete:project_uuid:' + project_uuid, json.dumps({
            'status': 'success'
        }))

    else:
        # Error occured
        emit('projects:delete:project_uuid:' + project_uuid, json.dumps({
            'status': 'error',
            'text': delete_result["text"]
        }))



scope_manager = ScopeManager()

@socketio.on('scopes:all:get')
def handle_custom_event():
    """ When received this message, send back all the scopes """
    emit('scopes:all:get:back', json.dumps(scope_manager.get_scopes()))


@socketio.on('scopes:create')
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
            
        else:
            error_found = True
            new_err = create_result["text"]

            if new_err not in error_text:
                error_text += new_err


    if error_found:        
        emit('scopes:create:' + project_name, json.dumps({
            'status': 'error',
            'text': error_text
        }))

    else:
        # Send the scope back
        emit('scopes:create:' + project_name, json.dumps({
            'status': 'success',
            'new_scopes': new_scopes
        }))


@socketio.on('scopes:delete:scope_id')
def handle_scope_deletiong(msg):
    """ When received this message, delete the scope """
    scope_id = msg

    # Delete new scope (and register it)
    delete_result = scope_manager.delete_scope(scope_id=scope_id)

    if delete_result["status"] == "success":
        # Send the success result
        emit('scopes:delete:scope_id:' + scope_id, json.dumps({
            'status': 'success'
        }))

    else:
        # Error occured
        emit('scopes:delete:scope_id:' + scope_id, json.dumps({
            'status': 'error',
            'text': delete_result["text"]
        }))


if __name__ == '__main__':
    socketio.run(app)
