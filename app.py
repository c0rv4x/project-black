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
