""" This module keeps a sexy class that initialises all the handlers and
starts task_poller. """
import re
import json
import queue
import asyncio

from common.logger import log

from events_handling.scopes_handlers import ScopeHandlers
from events_handling.tasks_handlers import TaskHandlers
from events_handling.files_handlers import FileHandlers
from events_handling.dicts_handlers import DictHandlers

from events_handling.new_data_notifier import Notifier

from managers import (
    ProjectManager, ScopeManager, TaskManager,
    ScanManager, FileManager, CredManager,
    DictManager
)


@log
class Handlers(object):

    def __init__(self, socketio, app, meta_manager):
        self.socketio = socketio
        self.app = app
        self.meta_manager = meta_manager

        # This queue keeps messages that indicate, that scope should be updated
        self.data_updated_queue = queue.Queue()

        self.meta_manager.task_manager.attach_data_updated_queue(self.data_updated_queue)
        self.app.add_task(self.meta_manager.task_manager.spawn_asynqp())

        self.scope_handlers = ScopeHandlers(self.socketio, self.meta_manager.scope_manager)
        self.file_handlers = FileHandlers(self.socketio, self.meta_manager.file_manager)
        self.task_handlers = TaskHandlers(self.socketio, self.meta_manager.task_manager)
        self.dict_handlers = DictHandlers(self.socketio, self.meta_manager.dict_manager)

        self.notifier = Notifier(self.socketio)

    async def sender_loop(self):
        await self.task_handlers.send_tasks_back()

        try:
            task_data = self.data_updated_queue.get_nowait()
            await self.notifier.notify(task_data)
            self.data_updated_queue.task_done()

        except queue.Empty:
            pass
