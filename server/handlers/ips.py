import json
from sanic import response

from server.handlers.utils import authorized_class_method


class IPsHandlers:
    def __init__(self, scope_manager, socketio):
        self.scope_manager = scope_manager
        self.notifier = IPsNotifier(socketio)


    @authorized_class_method()
    async def cb_get_ips(self, request, project_uuid):
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

            return response.json({}, status=200)
        else:
            return response.json({ 'message': result['text'] }, status=403)


    @authorized_class_method()
    async def cb_delete_ip(self, request, project_uuid):
        ip_id = request.json['ip_id']

        delete_result = await self.scope_manager.delete_scope(
            scope_id=ip_id, scope_type='ip_address')

        if delete_result['status'] == 'success':
            await self.notifier.notify_on_deleted_ip(
                project_uuid, ip_id
            )

            return response.json({}, status=200)
        else:
            return response.json({ 'message': delete_result['text'] }, status=403)


    @authorized_class_method()
    async def cb_get_tasks_for_ips(self, request, project_uuid):
        ips = request.json['ips']

        get_result = await self.scope_manager.get_tasks_filtered(
            project_uuid,
            ips=ips,
            hosts=None
        )

        if get_result['status'] == 'success':
            return response.json({
                'active': get_result['active'],
                'finished': get_result['finished']  
            }, status=200)
        else:
            return response.json({ 'message': get_result.text }, status=403)


    @authorized_class_method()
    async def cb_export(self, request, project_uuid):
        filters = request.json['filters']

        get_result = self.scope_manager.get_ips_with_ports(
            project_uuid=project_uuid,
            filters=filters
        )

        ips_formed = []
        for ip in get_result['ips']:
            scans = ip['scans']

            if scans:
                ip_address = ip['ip_address']

                ips_formed.append("Host {} ():    Ports: {}".format(
                    ip_address,
                    form_ports(scans)
                ))

        return response.text('\n'.join(ips_formed), status=200)


def form_ports(scans):
    return ', '.join(map(lambda scan: form_single_port(scan), scans))


def form_single_port(scan):
    port_data = [
        str(scan['port_number']),
        'open',
        'tcp',
        '',
        scan['protocol'],
        '',
        scan['banner'],
        ''
    ]

    return '/'.join(port_data)

class IPsNotifier:
    def __init__(self, socketio):
        self.socketio = socketio

    async def notify_on_created_ip(self, project_uuid):
        await self.socketio.emit(
            'ips:created', { 'project_uuid': project_uuid },
            room=None, namespace='/ips'
        )

    async def notify_on_deleted_ip(self, project_uuid, ip_id):
        await self.socketio.emit(
            'ip:deleted', {
                'ip_id': ip_id,
                'project_uuid': project_uuid
            },
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
