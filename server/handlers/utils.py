import base64
from functools import wraps
from sanic import response

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


def authorized_class_method():
    def decorator(func):
        @wraps(func)
        async def decorated_function(self, request, *args, **kwargs):
            # run some method that checks the request
            # for the client's authorization status
            is_authorized = check_authorization(request)

            if is_authorized:
                # the user is authorized.
                # run the handler method and return the response
                resp = await func(self, request, *args, **kwargs)
                return resp

            # the user is not authorized.
            return response.json(
                {'message': 'Not Authenticated'},
                headers={'WWW-Authenticate': 'Basic realm="Login Required"'},
                status=401
            )
        return decorated_function
    return decorator


