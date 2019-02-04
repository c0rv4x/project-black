from config import CONFIG
from managers import (
    ProjectManager, ScopeManager, TaskManager,
    ScanManager, FileManager, CredManager,
    DictManager
)

class MetaManager:
    def __init__(self):
        self.project_manager = ProjectManager()
        self.scope_manager = ScopeManager()

        self.scan_manager = ScanManager()
        self.file_manager = FileManager()
        self.creds_manager = CredManager()
        self.dict_manager = DictManager()

        self.task_manager = TaskManager(self.scope_manager)
        # self.app.add_task(self.task_manager.spawn_asynqp())