from events_handling.projects_handlers import initialize as projects_handlers_init_w_manager
from events_handling.scopes_handlers import initialize as scopes_handlers_init_w_manager
from events_handling.tasks_handlers import initialize as tasks_handlers_init_w_manager
from events_handling.scans_handlers import initialize as scans_handlers_init_w_manager

from managers import ProjectManager, ScopeManager, TaskManager, ScanManager


class Handlers(object):
	def __init__(self, socketio):
		self.socketio = socketio

		self.project_manager = ProjectManager()
		self.scope_manager = ScopeManager()
		self.task_manager = TaskManager()
		self.scan_manager = ScanManager()

		projects_handlers_init_w_manager(self.socketio, self.project_manager)
		scopes_handlers_init_w_manager(self.socketio, self.scope_manager)
		tasks_handlers_init_w_manager(self.socketio, self.task_manager)
		scans_handlers_init_w_manager(self.socketio, self.scan_manager)

	# def send_tasks(self):
