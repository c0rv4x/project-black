from sanic import response
from server.handlers.utils import authorized_class_method


class FilesHandlers:
    def __init__(self, file_manager):
        self.file_manager = file_manager


    @authorized_class_method()
    async def cb_count_files(self, request, project_uuid):
        amount_result = self.file_manager.count(project_uuid)

        return response.json(amount_result['amount'])
