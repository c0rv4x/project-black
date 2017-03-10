import uuid
import json

from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit

from projects_handling import ProjectManager


# Define Flask app and wrap it into SocketIO
app = Flask(__name__)
app.config['SECRET_KEY'] = 'KIwTR8ZUNG20UkhrXR0Pv0B9ZZigzQpVVT5KK6FA1M'
socketio = SocketIO(app)

project_manager = ProjectManager()

@app.route('/<path:path>')
def send_js(path):
    """ Simple server of statics """
    return send_from_directory('public', path)


@socketio.on('projects:all:get')
def handle_custom_event():
    """ When received this message, send back all the projects """
    emit('projects:all:get:back', json.dumps(project_manager.get_projects()))


@socketio.on('projects:create')
def handle_project_creation(msg):
    """ When received this message, send back all the projects """
    project_name = msg

    # Create new project (and register it)
    create_result = project_manager.create_project(project_name)

    if create_result["status"] == "success":
        # Send the project back
        emit('projects:create:' + project_name, json.dumps({
            'status': 'success',
            'text': create_result["new_project"]
        }))

    else:
        # Error occured
        emit('projects:create:' + project_name, json.dumps({
            'status': 'error',
            'text': create_result["text"]
        }))


# @socketio.on('projects:delete')
# def handle_project_creation(msg):
#     """ When received this message, send back all the projects """
#     project_name = msg

#     # Create new project (and register it)
#     create_result = project_manager.create_project(project_name)

#     if create_result["status"] == "success":
#         # Send the project back
#         emit('projects:create:' + project_name, json.dumps({
#             'status': 'success',
#             'text': create_result["new_project"]
#         }))

#     else:
#         # Error occured
#         emit('projects:create:' + project_name, json.dumps({
#             'status': 'error',
#             'text': create_result["text"]
#         }))

if __name__ == '__main__':
    socketio.run(app)
