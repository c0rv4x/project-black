import uuid
import json

from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.config['SECRET_KEY'] = 'KIwTR8ZUNG20UkhrXR0Pv0B9ZZigzQpVVT5KK6FA1M'
socketio = SocketIO(app)

@app.route('/<path:path>')
def send_js(path):
    return send_from_directory('public', path)

@socketio.on('projects:all')
def handle_message():
    emit('projects:all:back', json.dumps([
    {
    	"projectName": "proj_name_1",
    	"uuid": str(uuid.uuid4())
    }
    ]))

if __name__ == '__main__':
    socketio.run(app)
