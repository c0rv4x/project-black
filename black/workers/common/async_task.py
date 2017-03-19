""" Async class for Task"""
import asynqp
from black.db import sessions, models
from black.workers.common.task import Task


class AsyncTask(Task):
    """ Async class for the task """

    def __init__(self, task_id, task_type, target, params, project_uuid):
        Task.__init__(self, task_id, task_type, target, params, project_uuid)       

    async def initialize(self):
        # connect to the RabbitMQ broker
        connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

        # Open a communications channel
        channel = await connection.open_channel()

        # Create an exchange on the broker
        self.exchange = await channel.declare_exchange('tasks.exchange', 'direct')
        queue = await channel.declare_queue('tasks_statuses')
        await queue.bind(self.exchange, routing_key='tasks_statuses')

        self.set_status("New")

    def set_status(self, new_status):
        Task.set_status(self, new_status)

        msg = asynqp.Message({
            'task_id': self.task_id,
            'status': new_status
        })
        self.exchange.publish(msg, 'tasks_statuses')