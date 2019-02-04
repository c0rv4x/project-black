from sanic import response
from server.handlers.utils import authorized_class_method


class ProjectsHandlers:
    def __init__(self, project_manager):
        self.project_manager = project_manager


    @authorized_class_method()
    async def cb_get_projects(self, request):
        projects = await self.project_manager.get_projects()

        return response.json(projects)


    @authorized_class_method()
    async def cb_create_project(self, request):
        name = request.json['name']
        create_result = await self.project_manager.create_project(name)
        if create_result['status'] == 'success':
            return response.json({ 'status': 'ok' })
        else:
            return response.json({
                'status': 'error',
                'message': create_result['text']
            })


    @authorized_class_method()
    async def cb_delete_project(self, request):
        project_uuid = request.json['uuid']
        delete_result = await self.project_manager.delete_project(
            project_uuid=project_uuid)

        if delete_result['status'] == 'success':
            return response.json({ 'status': 'ok' })
        else:
            return response.json({
                'status': 'error',
                'message': delete_result['text']
            })
            