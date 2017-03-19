""" Sync class for Task"""
from black.db import sessions, models
from black.workers.common.task import Task


class SyncTask(Task):
    """ Sync class for the task """

    def __init__(self, task_id, task_type, target, params, project_uuid):
        Task.__init__(self, task_id, task_type, target, params, project_uuid)       

        # Connect to the queue
        credentials = pika.PlainCredentials('guest', 'guest')
        parameters = pika.ConnectionParameters('localhost', credentials=credentials)
        connection = pika.BlockingConnection(parameters)

        # Open a communications channel
        self.channel = connection.channel()
        self.channel.exchange_declare(
            exchange="tasks.exchange",
            exchange_type="direct",
            durable=True)
        self.channel.queue_declare(queue="tasks_statuses", durable=True, auto_delete=True)
        self.channel.queue_bind(
            queue="tasks_statuses",
            exchange="tasks.exchange",
            routing_key="tasks_statuses")
