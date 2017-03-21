# import threading

from events_handling.projects_handlers import ProjectHandlers
from events_handling.scopes_handlers import ScopeHandlers
from events_handling.tasks_handlers import TaskHandlers
from events_handling.scans_handlers import ScanHandlers

from managers import ProjectManager, ScopeManager, TaskManager, ScanManager


class Handlers(object):
    def __init__(self, socketio):
        self.socketio = socketio

        self.project_manager = ProjectManager()
        self.scope_manager = ScopeManager()
        self.task_manager = TaskManager()
        self.scan_manager = ScanManager()

        self.projectsHandlers = ProjectHandlers(self.socketio, self.project_manager)
        self.scopesHandlers = ScopeHandlers(self.socketio, self.scope_manager)
        self.taskHandlers = TaskHandlers(self.socketio, self.task_manager)
        self.scansHandlers = ScanHandlers(self.socketio, self.scan_manager)

        self.thread = socketio.start_background_task(target=self.sender_loop)
        # self.thread.start

    def sender_loop(self):
        while True:
            self.socketio.sleep(0.7)
            self.taskHandlers.send_tasks_back()

