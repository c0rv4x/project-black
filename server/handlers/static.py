import os

from sanic import response

from server.handlers.utils import authorized


class StaticHandlers:
    @staticmethod
    @authorized()
    async def cb_index_handler(request, project_uuid=None, host=None):
        return await response.file_stream(os.path.abspath('./public/index.html'))

    @staticmethod
    @authorized()
    async def cb_bundle_handler(request):
        return await response.file_stream(os.path.abspath('./public/bundle.js'))

    @staticmethod
    @authorized()
    async def cb_serve_media_file(request, filename=""):
        return await response.file_stream(os.path.join('./public', os.path.basename(request.path)))
