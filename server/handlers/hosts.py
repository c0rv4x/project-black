import json
from sanic import response

from server.handlers.utils import authorized_class_method


class HostsHandlers:
    def __init__(self, scope_manager, socketio):
        self.scope_manager = scope_manager
        self.notifier = HostsNotifier(socketio)

    @authorized_class_method()
    async def cb_get_hosts(self, request, project_uuid):
        project_uuid = int(project_uuid)
        params = request.raw_args
        host_page = int(params.get('host_page', '0'))
        host_page_size = int(params.get('host_page_size', '12'))
        filters = json.loads(params.get('filters', '{}'))

        hosts = self.scope_manager.get_hosts_with_ports(
            filters, project_uuid, host_page, host_page_size)

        return response.json({
            'page': host_page,
            'page_size': host_page_size,
            'data': hosts['hosts'],
            'total_db_hosts': hosts['total_db_hosts'],
            'selected_hosts': hosts['selected_hosts']
        })

    @authorized_class_method()
    async def cb_get_single_host(self, request, project_uuid, hostname):
        project_uuid = int(project_uuid)

        hosts = self.scope_manager.get_hosts_with_ports(
            { 'host': [hostname] }, project_uuid
        )

        return response.json({
            'page': 0,
            'page_size': 1,
            'data': hosts['hosts'],
            'total_db_hosts': hosts['total_db_hosts'],
            'selected_hosts': hosts['selected_hosts']
        })

    @authorized_class_method()
    async def cb_update_comment(self, request, project_uuid, host_id):
        comment = request.json['comment']

        result = await self.scope_manager.update_scope(
            scope_id=host_id, comment=comment, scope_type='hostname'
        )

        if result['status'] == 'success':
            await self.notifier.notify_on_updated_host(
                project_uuid, host_id, comment
            )

            return response.json({ 'status': 'ok' })
        else:
            return response.json({ 'status': 'error', 'message': result['text'] })


    @authorized_class_method()
    async def cb_delete_host(self, request, project_uuid):
        host_id = request.json['host_id']

        delete_result = await self.scope_manager.delete_scope(
            scope_id=host_id, scope_type='hostname')

        if delete_result['status'] == 'success':
            await self.notifier.notify_on_deleted_host(
                project_uuid, host_id
            )

            return response.json({ 'status': 'ok' })
        else:
            return response.json({ 'status': 'error', 'message': delete_result['text'] })


class HostsNotifier:
    def __init__(self, socketio):
        self.socketio = socketio

    async def notify_on_created_host(self, project_uuid):
        await self.socketio.emit(
            'hosts:created', { 'project_uuid': project_uuid },
            room=None, namespace='/hosts'
        )

    async def notify_on_deleted_host(self, project_uuid, host_id):
        await self.socketio.emit(
            'host:deleted', {
                'host_id': host_id,
                'project_uuid': project_uuid
            },
            room=None, namespace='/hosts'
        )

    async def notify_on_updated_host(self, project_uuid, host_id, comment):
        await self.socketio.emit(
            'host:comment_updated', {
                'project_uuid': project_uuid,
                'host_id': host_id,
                'comment': comment
            },
            room=None, namespace='/hosts'
        )
