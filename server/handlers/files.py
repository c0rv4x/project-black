from sanic import response
from server.handlers.utils import authorized_class_method


class FilesHandlers:
    def __init__(self, file_manager):
        self.file_manager = file_manager


    @authorized_class_method()
    async def cb_count_files(self, request, project_uuid):
        amount_result = self.file_manager.count(project_uuid)

        if amount_result['status'] == 'success':
            return response.json(amount_result['amount'], status=200)
        else:
            return response.json({ 'message': amount_result['text'] }, status=403)

    @authorized_class_method()
    async def cb_stats_hosts(self, request, project_uuid):
        params = request.json
        host_ids = params['host_ids']
        filters = params['filters']

        get_result = self.file_manager.get_stats_hosts(project_uuid, host_ids, filters)

        if get_result['status'] == 'success':
            return response.json(get_result['stats'], status=200)
        else:
            return response.json({ 'message': get_result['text'] }, status=403)


    @authorized_class_method()
    async def cb_stats_ips(self, request, project_uuid):
        params = request.json
        ip_ids = params['ip_ids']
        filters = params['filters']

        get_result = self.file_manager.get_stats_ips(project_uuid, ip_ids, filters)

        if get_result['status'] == 'success':
            return response.json(get_result['stats'], status=200)
        else:
            return response.json({ 'message': get_result['text'] }, status=403)


    @authorized_class_method()
    async def cb_get_files_host(self, request, project_uuid):
        params = request.json
        host = params['host']
        port_number = int(params['port_number'])
        limit = int(params['limit'])
        offset = int(params['offset'])
        filters = params.get('filters', None)

        get_result = self.file_manager.get_files_hosts(host, port_number, limit, offset, filters)

        if get_result['status'] == 'success':
            files = list(map(
                lambda file: file.dict(),
                get_result['files']
            ))

            return response.json(files, status=200)
        else:
            return response.json({ 'message': get_result['text'] }, status=403)


    @authorized_class_method()
    async def cb_get_files_ip(self, request, project_uuid):
        params = request.json
        ip = params['ip']
        port_number = int(params['port_number'])
        limit = int(params['limit'])
        offset = int(params['offset'])
        filters = params.get('filters', None)

        get_result = self.file_manager.get_files_ips(ip, port_number, limit, offset, filters)

        if get_result['status'] == 'success':
            files = list(map(
                lambda file: file.dict(),
                get_result['files']
            ))

            return response.json(files, status=200)
        else:
            return response.json({ 'message': get_result['text'] }, status=403)
