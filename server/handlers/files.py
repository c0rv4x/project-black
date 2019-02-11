from sanic import response
from server.handlers.utils import authorized_class_method


class FilesHandlers:
    def __init__(self, file_manager):
        self.file_manager = file_manager


    @authorized_class_method()
    async def cb_count_files(self, request, project_uuid):
        amount_result = self.file_manager.count(project_uuid)

        return response.json(amount_result['amount'])


    @authorized_class_method()
    async def cb_stats_hosts(self, request, project_uuid):
        params = request.json
        host_ids = params['host_ids']
        filters = params['filters']

        get_result = self.file_manager.get_stats_hosts(project_uuid, host_ids, filters)

        return response.json(get_result['stats'])


    @authorized_class_method()
    async def cb_stats_ips(self, request, project_uuid):
        params = request.json
        ip_ids = params['ip_ids']
        filters = params['filters']

        get_result = self.file_manager.get_stats_ips(project_uuid, ip_ids, filters)

        return response.json(get_result['stats'])



