import queue

from events_handling.projects_handlers import register_project_handlers
from events_handling.scopes_handlers import ScopeHandlers
from events_handling.tasks_handlers import TaskHandlers
from events_handling.scans_handlers import ScanHandlers
from events_handling.files_handlers import FileHandlers

from managers import ProjectManager, ScopeManager, TaskManager, ScanManager, FileManager


class Handlers(object):

    def __init__(self, socketio):
        self.socketio = socketio

        # This queue keeps messages that indicate, that scope should be updated
        self.data_updated_queue = queue.Queue()

        self.project_manager = ProjectManager()
        self.scope_manager = ScopeManager()
        self.task_manager = TaskManager(self.data_updated_queue)
        self.scan_manager = ScanManager()
        self.file_manager = FileManager()

        register_project_handlers(self.socketio, self.project_manager)
        # self.scopeHandlers = ScopeHandlers(self.socketio, self.scope_manager)
        # self.taskHandlers = TaskHandlers(self.socketio, self.task_manager)
        # self.scanHandlers = ScanHandlers(self.socketio, self.scan_manager)
        # self.fileHandlers = FileHandlers(self.socketio, self.file_manager)

        # self.thread = socketio.start_background_task(target=self.sender_loop)
        # self.thread.start

    def sender_loop(self):
        self.socketio.sleep(5)
        while True:
            self.socketio.sleep(0.7)
            self.taskHandlers.send_tasks_back()

            try:
                task_type, project_uuid = self.data_updated_queue.get_nowait()

                if task_type == "scan":
                    self.scanHandlers.send_scans_back(project_uuid)
                    self.data_updated_queue.task_done()
                if task_type == "file":
                    self.fileHandlers.send_files_back(project_uuid)
                    self.data_updated_queue.task_done()
                if task_type == "scope":
                    self.scopeHandlers.send_scopes_back(project_uuid)
                    self.data_updated_queue.task_done()                                        
            except queue.Empty as e:
                continue
