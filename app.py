""" Main application, running on sanic """
import os
import socketio

from sanic import Sanic, response

from events_handling import Handlers


async def complex_handler(request, project_uuid):
    return await response.file_stream(os.path.abspath('./public/index.html'))


SOCKET_IO = socketio.AsyncServer(async_mode='sanic')
APP = Sanic()

SOCKET_IO.attach(APP)

APP.static('/', './public/index.html')
APP.static('/bundle.js', './public/bundle.js')
APP.add_route(complex_handler, '/project/<project_uuid>')

Handlers(SOCKET_IO)

APP.run(host='127.0.0.1', port=5000)
