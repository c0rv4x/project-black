import json
from sanic import response

from server.handlers.utils import authorized_class_method


class IPsHandlers:
    def __init__(self, scope_manager, socketio):
        self.scope_manager = scope_manager

    @authorized_class_method()
    async def cb_get_ips(self, request, project_uuid):
        project_uuid = int(project_uuid)
        params = request.raw_args
        ip_page = int(params.get('ip_page', '0'))
        ip_page_size = int(params.get('ip_page_size', '12'))
        filters = json.loads(params.get('filters', '{}'))

        ips = self.scope_manager.get_ips_with_ports(
            filters, project_uuid, ip_page, ip_page_size)

        return response.json({
            'page': ip_page,
            'page_size': ip_page_size,
            'data': ips['ips'],
            'selected_ips': ips['selected_ips'],
            'total_db_ips': ips['total_db_ips']
        })
