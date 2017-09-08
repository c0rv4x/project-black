""" Main application, running on sanic """
import os
import base64
from functools import wraps

import socketio
from sanic import Sanic, response

from events_handling import Handlers


def check_authorization(request):
    """ Check if authed """
    if request.token:
        encoded = request.token.split(' ')[1]
        authentication = base64.b64decode(encoded).decode('utf-8')

        login = authentication.split(':')[0]
        password = authentication.split(':')[1]

        if login == 'pt' and password == 'blackisbackfuckers':
            return True

    return False


def authorized():
    def decorator(func):
        @wraps(func)
        async def decorated_function(request, *args, **kwargs):
            # run some method that checks the request
            # for the client's authorization status
            is_authorized = check_authorization(request)

            if is_authorized:
                # the user is authorized.
                # run the handler method and return the response
                resp = await func(request, *args, **kwargs)
                return resp

            # the user is not authorized.
            return response.json(
                {'message': 'Not Authenticated'},
                headers={'WWW-Authenticate': 'Basic realm="Login Required"'},
                status=401
            )
        return decorated_function
    return decorator


@authorized()
async def cb_complex_handler(request, project_uuid=None):
    """ Simlpy returns index.html """
    return await response.file_stream(os.path.abspath('./public/index.html'))

@authorized()
async def cb_complex_handler_bundle(request):
    """ Simlpy returns bundle.js """
    return await response.file_stream(os.path.abspath('./public/bundle.js'))




SOCKET_IO = socketio.AsyncServer(async_mode='sanic')
APP = Sanic()

SOCKET_IO.attach(APP)

APP.add_route(cb_complex_handler, '/')
APP.add_route(cb_complex_handler_bundle, '/bundle.js')
APP.add_route(cb_complex_handler, '/project/<project_uuid>')

Handlers(SOCKET_IO, APP)

APP.run(host='127.0.0.1', port=5000)
