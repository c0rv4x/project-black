""" This module keeps a sexy class that initialises all the handlers and
starts task_poller. """
import json
import queue
import asyncio

from events_handling.projects_handlers import register_project_handlers
from events_handling.scopes_handlers import ScopeHandlers
from events_handling.tasks_handlers import TaskHandlers
from events_handling.scans_handlers import ScanHandlers
from events_handling.files_handlers import FileHandlers

from managers import ProjectManager, ScopeManager, TaskManager, ScanManager, FileManager


class Handlers(object):

    def __init__(self, socketio, app):
        self.socketio = socketio
        self.app = app

        # This queue keeps messages that indicate, that scope should be updated
        self.data_updated_queue = queue.Queue()

        self.project_manager = ProjectManager()
        self.scope_manager = ScopeManager()
        self.task_manager = TaskManager(self.data_updated_queue, self.scope_manager)
        self.app.add_task(self.task_manager.spawn_asynqp())

        self.scan_manager = ScanManager()
        self.file_manager = FileManager()


        register_project_handlers(self.socketio, self.project_manager)

        self.scope_handlers = ScopeHandlers(self.socketio, self.scope_manager)
        self.scope_handlers.register_handlers()

        self.scan_handlers = ScanHandlers(self.socketio, self.scan_manager)
        self.scan_handlers.register_handlers()

        self.file_handlers = FileHandlers(self.socketio, self.file_manager)
        self.file_handlers.register_handlers()

        self.task_handlers = TaskHandlers(self.socketio, self.task_manager)
        self.task_handlers.register_handlers()

    async def sender_loop(self):
        await self.task_handlers.send_tasks_back()

        try:
            task_type, project_uuid, text = self.data_updated_queue.get_nowait()

            if task_type == "scope":
                # This is triggered when dnsscan find something new
                self.scope_manager.update_from_db(project_uuid)
                await self.scope_handlers.send_scopes_back(project_uuid, broadcast=True)

                self.data_updated_queue.task_done()

            if task_type == "scan":
                # Masscan or nmap updated some of the ips
                scope_ids = None

                if text:
                    scope_ids = text

                await self.scan_handlers.notify_on_updated_scans(scope_ids, project_uuid)

                self.data_updated_queue.task_done()

            if task_type == "file":
                updated_target = None

                if text:
                    updated_target = text.split(':')[0]

                    await self.file_handlers.notify_on_updated_files(project_uuid, updated_target)

                self.data_updated_queue.task_done()

        except queue.Empty:
            pass
