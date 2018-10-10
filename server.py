""" Main application, running on sanic """
import os
import base64
from functools import wraps

import socketio
from sanic import Sanic, response
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from events_handling import Handlers
from black.db.models.dictionary import DictDatabase

from common.logger import init_default
from config import CONFIG


def check_authorization(request):
    """ Check if authed """
    if request.token:
        encoded = request.token.split(' ')[1]
        authentication = base64.b64decode(encoded).decode('utf-8')

        login = authentication.split(':')[0]
        password = authentication.split(':')[1]

        if login == CONFIG['application']['username'] and password == CONFIG['application']['password']:
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
async def cb_complex_handler(request, project_uuid=None, host=None):
    return await response.file_stream(os.path.abspath('./public/index.html'))

@authorized()
async def cb_complex_handler_bundle(request):
    return await response.file_stream(os.path.abspath('./public/bundle.js'))

@authorized()
async def cb_serve_media_file(request, filename=""):
    return await response.file_stream(os.path.join('./public', os.path.basename(request.path)))

@authorized()
async def cb_upload_dict(request):
    dict_params = request.json
    content = base64.b64decode(dict_params["content"]).decode('utf-8')
    save_result = HANDLERS.dict_manager.create(
        name=dict_params["name"],
        dict_type=dict_params["dict_type"],
        content=content,
        project_uuid=dict_params["project_uuid"]
    )

    if save_result["status"] == "success":
        save_result["dictionary"] = save_result["dictionary"].dict()

        return response.json(save_result, status=200)
    return response.json(save_result, status=500)

@authorized()
async def cb_get_dictionary(request, dict_id):
    get_result = DictDatabase.get(dict_id=dict_id)

    if get_result["status"] == "success":
        if len(get_result["dicts"]) == 0:
            return response.text("Dictionary not found", status=200)
        else:
            return response.text(get_result["dicts"][0].content, status=200)
    else:
        return response.text(get_result, status=500)


init_default()

SOCKET_IO = socketio.AsyncServer(async_mode='sanic')
APP = Sanic()

SOCKET_IO.attach(APP)

APP.add_route(cb_complex_handler, '/')
APP.add_route(cb_complex_handler, '/project/<project_uuid>')
APP.add_route(cb_complex_handler, '/project/<project_uuid>/dirsearch')
APP.add_route(cb_complex_handler, '/project/<project_uuid>/host/<host>')
APP.add_route(cb_complex_handler, '/project/<project_uuid>/ip/<host>')

APP.add_route(cb_upload_dict, '/upload_dict', methods=['POST'])
APP.add_route(cb_get_dictionary, '/dictionary/<dict_id>')


APP.add_route(cb_complex_handler_bundle, '/bundle.js')
APP.add_route(cb_serve_media_file, '/<filename:[a-z0-9]+.(eot|woff|woff2)>')

APP.static('static', './public/static')

HANDLERS = Handlers(SOCKET_IO, APP)

@APP.listener('before_server_start')
async def cb_instantiate_scheduler(app, loop):
    scheduler = AsyncIOScheduler()
    scheduler.add_job(HANDLERS.sender_loop, 'interval', seconds=1)
    scheduler.start()


APP.run(host=CONFIG['application']['host'], port=CONFIG['application']['port'], debug=False)
