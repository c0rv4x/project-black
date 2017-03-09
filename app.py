import uuid
import json

from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = 'KIwTR8ZUNG20UkhrXR0Pv0B9ZZigzQpVVT5KK6FA1M'
socketio = SocketIO(app)


@app.route('/<path:path>')
def send_js(path):
    """ Simple server of statics """
    return send_from_directory('public', path)


projects = [{
    "projectName": "proj_name_1",
    "uuid": str(uuid.uuid4())
}]

@socketio.on('projects:all:get')
def handle_custom_event():
    """ When received this message, send back all the projects """
    emit('projects:all:get:back', json.dumps(projects))


@socketio.on('projects:create')
def handle_project_creation(msg):
    """ When received this message, send back all the projects """
    project_name = msg
    print(projects)
    existing_project = list(filter(lambda x: x['projectName'] == project_name, projects))
    if len(existing_project) > 0:
        emit('projects:create:' + project_name, json.dumps({
            'status': 'error',
            'text': 'Already exists that specific project name.'
        }))
    else :
        project = {
            "projectName": project_name,
            "uuid": str(uuid.uuid4()) 
        }

        projects.append(project)

        emit('projects:create:' + project_name, json.dumps({
            'status': 'success',
            'text': project
        }))


@socketio.on('projects:print_terminal')
def handle_custom_event():
    """ DEBUG """
    print(projects)

if __name__ == '__main__':
    socketio.run(app)
