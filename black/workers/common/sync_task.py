""" Sync class for Task"""
import pika
import json

from .sync_publisher import SyncPublisher
from black.db import sessions, models
from black.workers.common.task import Task


def cbb(connection, reply_code, reply_text) :
    print('Connection closed', connection, reply_code, reply_text)

class SyncTask(Task):
    """ Sync class for the task """

    def __init__(self, task_id, task_type, target, params, project_uuid):
        Task.__init__(self, task_id, task_type, target, params, project_uuid)       

        self.sync_publisher = SyncPublisher('tasks_statuses')
        self.sync_publisher.connect()

    def set_status(self, new_status, progress=0, text=""):
        Task.set_status(self, new_status, progress=progress, text=text)

        self.sync_publisher.send(json.dumps({
                'task_id': self.task_id,
                'status': new_status,
                'progress': progress,
                'text': text,
                'new_stdout': "",
                'new_stderr': ""
            }))

    def finish(self):
        self.sync_publisher.close()