""" Main application, running on sanic """
import socketio

from sanic import Sanic

from events_handling import Handlers


SOCKET_IO = socketio.AsyncServer(async_mode='sanic')
APP = Sanic()

SOCKET_IO.attach(APP)

APP.static('/', './public/index.html')
APP.static('/bundle.js', './public/bundle.js')

Handlers(SOCKET_IO)

APP.run(host='127.0.0.1', port=5000)








# from flask import Flask, render_template, send_from_directory
# from werkzeug.routing import BaseConverter

# from flask_socketio import SocketIO

# from events_handling import Handlers
# from functools import wraps
# from flask import request, Response


# # Define Flask app and wrap it into SocketIO
# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'KIwTR8ZUNG20UkhrXR0Pv0B9ZZigzQpVVT5KK6FA1M'
# socketio = SocketIO(app, engineio_logger=True, async_mode='gevent')
# # socketio = SocketIO(app)

# class RegexConverter(BaseConverter):
#     def __init__(self, url_map, *items):
#         super(RegexConverter, self).__init__(url_map)
#         self.regex = items[0]

# app.url_map.converters['regex'] = RegexConverter


# h = Handlers(socketio)

# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', debug=False)
