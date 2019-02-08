from sanic import response
from server.handlers.utils import authorized_class_method


class CredsHandlers:
    def __init__(self, creds_manager):
        self.creds_manager = creds_manager

    @authorized_class_method()
    async def cb_get_creds(self, request, project_uuid):
        targets = request.json['targets']
        get_result = self.creds_manager.get_creds(targets=targets, project_uuid=project_uuid)

        return response.json(get_result)
