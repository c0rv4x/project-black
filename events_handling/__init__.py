import queue

from events_handling.projects_handlers import ProjectHandlers
from events_handling.scopes_handlers import ScopeHandlers
from events_handling.tasks_handlers import TaskHandlers
from events_handling.scans_handlers import ScanHandlers

from managers import ProjectManager, ScopeManager, TaskManager, ScanManager


class Handlers(object):
    def __init__(self, socketio):
        self.socketio = socketio

        # This queue keeps messages that indicate, that scope should be updated
        self.data_updated_queue = queue.Queue()

        self.project_manager = ProjectManager()
        self.scope_manager = ScopeManager()
        self.task_manager = TaskManager(self.data_updated_queue)
        self.scan_manager = ScanManager()

        self.projectHandlers = ProjectHandlers(self.socketio, self.project_manager)
        self.scopeHandlers = ScopeHandlers(self.socketio, self.scope_manager)
        self.taskHandlers = TaskHandlers(self.socketio, self.task_manager)
        self.scanHandlers = ScanHandlers(self.socketio, self.scan_manager)

        self.thread = socketio.start_background_task(target=self.sender_loop)
        # self.thread.start

    def sender_loop(self):
        while True:
            self.socketio.sleep(0.7)
            print("sending tasks back")
            self.taskHandlers.send_tasks_back()

            try:
                updated = self.data_updated_queue.get_nowait()

                if updated == "scan":
                    print("smooth sending scans back")
                    self.scanHandlers.send_scans_back()
                    self.data_updated_queue.task_done()
            except queue.Empty as e:
                print("no data")

                continue
