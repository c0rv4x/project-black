""" This module keeps a sexy class that initialises all the handlers and
starts task_poller. """
import re
import json
import queue
import asyncio

from common.logger import log

from events_handling.projects_handlers import ProjectHandlers
from events_handling.scopes_handlers import ScopeHandlers
from events_handling.tasks_handlers import TaskHandlers
from events_handling.scans_handlers import ScanHandlers
from events_handling.files_handlers import FileHandlers
from events_handling.creds_handlers import CredHandlers
from events_handling.dicts_handlers import DictHandlers

from events_handling.new_data_notifier import Notifier

from managers import (
    ProjectManager, ScopeManager, TaskManager,
    ScanManager, FileManager, CredManager,
    DictManager
)


@log
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
        self.creds_manager = CredManager()
        self.dict_manager = DictManager()

        ProjectHandlers(self.socketio, self.project_manager)

        self.scope_handlers = ScopeHandlers(self.socketio, self.scope_manager)
        self.scan_handlers = ScanHandlers(self.socketio, self.scan_manager)
        self.file_handlers = FileHandlers(self.socketio, self.file_manager)
        self.task_handlers = TaskHandlers(self.socketio, self.task_manager)
        self.cred_handlers = CredHandlers(self.socketio, self.creds_manager)
        self.dict_handlers = DictHandlers(self.socketio, self.dict_manager)

        self.notifier = Notifier(self.socketio)

    async def sender_loop(self):
        await self.task_handlers.send_tasks_back()

        try:
            task_data = self.data_updated_queue.get_nowait()
            await self.notifier.notify(task_data)
            self.data_updated_queue.task_done()

        except queue.Empty:
            pass
