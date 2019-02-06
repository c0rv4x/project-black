import json
from sanic import response

from server.handlers.utils import authorized_class_method


class IPsHandlers:
    def __init__(self, scope_manager, socketio):
        self.scope_manager = scope_manager
        self.notifier = IPsNotifier(socketio)

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

    @authorized_class_method()
    async def cb_get_single_ip(self, request, project_uuid, ip_address):
        project_uuid = int(project_uuid)

        ips = self.scope_manager.get_ips_with_ports(
            { 'ip': [ip_address] }, project_uuid
        )

        return response.json({
            'page': 0,
            'page_size': 1,
            'data': ips['ips'],
            'selected_ips': ips['selected_ips'],
            'total_db_ips': ips['total_db_ips']
        })

    @authorized_class_method()
    async def cb_update_comment(self, request, project_uuid, ip_id):
        comment = request.json['comment']

        result = await self.scope_manager.update_scope(
            scope_id=ip_id, comment=comment, scope_type='ip_address'
        )

        if result['status'] == 'success':
            await self.notifier.notify_on_updated_ip(
                project_uuid, ip_id, comment
            )

            return response.json({ 'status': 'ok' })
        else:
            return response.json({ 'status': 'error', 'message': result['text'] })


class IPsNotifier:
    def __init__(self, socketio):
        self.socketio = socketio

    async def notify_on_created_ip(self):
        await self.socketio.emit(
            'ips:created', {},
            room=None, namespace='/ips'
        )

    async def notify_on_deleted_ip(self):
        await self.socketio.emit(
            'ip:deleted', {},
            room=None, namespace='/ips'
        )

    async def notify_on_updated_ip(self, project_uuid, ip_id, comment):
        await self.socketio.emit(
            'ip:comment_updated', {
                'project_uuid': project_uuid,
                'ip_id': ip_id,
                'comment': comment
            },
            room=None, namespace='/ips'
        )
