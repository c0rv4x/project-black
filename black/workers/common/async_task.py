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
        exchange = await channel.declare_exchange('tasks.exchange', 'direct')

        # Create two queues on the exchange
        self.response_queue = await channel.declare_queue(self.task_id, auto_delete=True)

        # Bind the queue to the exchange, so the queue will get messages published to the exchange
        await self.response_queue.bind(exchange, routing_key=self.task_id)
