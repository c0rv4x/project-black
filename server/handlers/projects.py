from sanic import response
from server.handlers.utils import authorized


class ProjectsHandlers:
    def __init__(self, project_manager):
        self.project_manager = project_manager

    @authorized()
    async def cb_get_projects(self, request):
        projects = await self.project_manager.get_projects()

        return await response.json(projects)
