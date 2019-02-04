from sanic import response
from server.handlers.utils import authorized_class_method


class ProjectsHandlers:
    def __init__(self, project_manager):
        self.project_manager = project_manager

    @authorized_class_method()
    async def cb_get_projects(self, request):
        projects = await self.project_manager.get_projects()

        return response.json(projects)
