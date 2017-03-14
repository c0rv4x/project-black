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



@socketio.on('projects:all:get', namespace='/black')
def handle_custom_event():
    """ When received this message, send back all the projects """
    emit('projects:all:get:back', json.dumps(project_manager.get_projects()), namespace='/black', broadcast=True)


@socketio.on('projects:create', namespace='/black')
def handle_project_creation(msg):
    """ When received this message, create a new projects """
    project_name = msg['project_name']

    # Create new project (and register it)
    addition_result = project_manager.add_new_project(project_name)

    if addition_result["status"] == "success":
        # Send the project back
        emit('projects:create', json.dumps({
            'status': 'success',
            'new_roject': addition_result["new_project"]
        }), namespace='/black', broadcast=True)
    else:
        # Error occured
        emit('projects:create', json.dumps({
            'status': 'error',
            'text': addition_result["text"]
        }), namespace='/black', broadcast=True)


@socketio.on('projects:delete:project_uuid', namespace='/black')
def handle_project_creation(msg):
    """ When received this message, delete the project """
    project_uuid = msg

    # Delete new project (and register it)
    delete_result = project_manager.delete_project(project_uuid=project_uuid)

    if delete_result["status"] == "success":
        # Send the success result
        emit('projects:delete', json.dumps({
            'status': 'success',
            'project_uuid': project_uuid
        }), namespace='/black', broadcast=True)

    else:
        # Error occured
        emit('projects:delete', json.dumps({
            'status': 'error',
            'text': delete_result["text"]
        }), namespace='/black', broadcast=True)



@socketio.on('projects:update', namespace='/black')
def handle_project_updating(msg):
    """ When received this message, update the project """
    project_uuid = msg['project_uuid']
    project_name = msg['project_name']
    comment = msg['comment']

    # Update the existing project
    updating_status = project_manager.update_project(project_uuid, project_name, comment)

    if updating_status["status"] == "success":
        # Send the project back
        emit('projects:update:' + project_uuid, json.dumps({
            'status': 'success',
            'new_project': {
                'project_uuid': project_uuid,
                'project_name': project_name,
                'comment': comment,
            }
        }), namespace='/black', broadcast=True)


    else:
        # Error occured
        emit('projects:update:' + project_uuid, json.dumps({
            'status': 'error',
            'text': updating_status["text"]
        }), namespace='/black', broadcast=True)



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


if __name__ == '__main__':
    socketio.run(app)
