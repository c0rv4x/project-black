from sanic import response
from server.handlers.utils import authorized_class_method


class ScansHandlers:
    def __init__(self, scan_manager):
        self.scan_manager = scan_manager


    @authorized_class_method()
    async def cb_count_scans(self, request, project_uuid):
        amount = self.scan_manager.count(project_uuid)

        return response.json(amount)
