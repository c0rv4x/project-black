from sanic import response
from server.handlers.utils import authorized_class_method


class ProjectsHandlers:
    def __init__(self, project_manager, socketio):
        self.project_manager = project_manager
        self.notifier = ProjectsNotifier(socketio)

    @authorized_class_method()
    async def cb_get_projects(self, request):
        projects = await self.project_manager.get_projects()

        return response.json(projects)


    @authorized_class_method()
    async def cb_create_project(self, request):
        name = request.json['name']
        create_result = await self.project_manager.create_project(name)
        if create_result['status'] == 'success':
            await self.notifier.notify_on_created_project()

            return response.json({}, status=200)
        else:
            return response.json({ 'message': create_result['text'] }, status=403)


    @authorized_class_method()
    async def cb_delete_project(self, request):
        project_uuid = request.json['uuid']
        delete_result = await self.project_manager.delete_project(
            project_uuid=project_uuid)

        if delete_result['status'] == 'success':
            await self.notifier.notify_on_deleted_project()

            return response.json({}, status=200)
        else:
            return response.json({ 'message': delete_result['text'] }, status=403)
            

    @authorized_class_method()
    async def cb_update_project(self, request):
        project_uuid = request.json['uuid']
        parameters = request.json['parameters']
        project_name = parameters.get('project_name', None)
        comment = parameters.get('comment', None)
        ips_locked = parameters.get('ips_locked', None)
        hosts_locked = parameters.get('hosts_locked', None)

        update_result = await self.project_manager.update_project(
            project_uuid, project_name=project_name, comment=comment,
            ips_locked=ips_locked, hosts_locked=hosts_locked)

        if update_result['status'] == 'success':
            await self.notifier.notify_on_updated_project()

            return response.json({}, status=200)
        else:
            return response.json({ 'message': update_result['text'] }, status=403)


class ProjectsNotifier:
    def __init__(self, socketio):
        self.socketio = socketio

    async def notify_on_created_project(self):
        await self.socketio.emit(
            'project:created', {},
            room=None, namespace='/projects'
        )

    async def notify_on_deleted_project(self):
        await self.socketio.emit(
            'project:deleted', {},
            room=None, namespace='/projects'
        )

    async def notify_on_updated_project(self):
        await self.socketio.emit(
            'project:updated', {},
            room=None, namespace='/projects'
        )
