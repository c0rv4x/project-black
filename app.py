import uuid
import json

from flask import Flask, render_template, send_from_directory
from werkzeug.routing import BaseConverter

from flask_socketio import SocketIO

from events_handling import Handlers


# Define Flask app and wrap it into SocketIO
app = Flask(__name__)
app.config['SECRET_KEY'] = 'KIwTR8ZUNG20UkhrXR0Pv0B9ZZigzQpVVT5KK6FA1M'
# socketio = SocketIO(app, engineio_logger=True)
socketio = SocketIO(app)

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter


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


h = Handlers(socketio)

if __name__ == '__main__':
    socketio.run(app)
