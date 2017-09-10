""" Async class for Task"""
import asynqp
from asyncio import Lock
from black.db import sessions, models
from black.workers.common.task import Task


class AsyncTask(Task):
    """ Async class for the task """

    def __init__(self, task_id, task_type, target, params, project_uuid):
        Task.__init__(self, task_id, task_type, target, params, project_uuid)
        self.exchange_lock = None
        self.connection = None
        self.channel = None
        self.exchange = None

    async def __aenter__(self):
        # connect to the RabbitMQ broker
        self.connection = await asynqp.connect(
            'localhost', 5672, username='guest', password='guest'
        )

        # Open a communications channel
        self.channel = await self.connection.open_channel()

        # Create an exchange on the broker
        self.exchange = await self.channel.declare_exchange(
            'tasks.exchange', 'direct'
        )
        queue = await self.channel.declare_queue('tasks_statuses')
        await queue.bind(self.exchange, routing_key='tasks_statuses')

        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.channel.close()
        await self.connection.close()

    async def initialize(self):
        self.exchange_lock = Lock()

        await self.set_status("New")

    async def set_status(self, new_status, progress=0, text=""):
        Task.set_status(self, new_status, progress=progress, text=text)

        msg = asynqp.Message(
            {
                'task_id': self.task_id,
                'status': new_status,
                'progress': progress,
                'text': text,
                'new_stdout': "",
                'new_stderr': ""
            }
        )

        await self.exchange_lock.acquire()
        self.exchange.publish(msg, 'tasks_statuses')
        self.exchange_lock.release()

    async def append_stdout(self, new_stdout):
        new_stdout = new_stdout
        Task.append_stdout(self, new_stdout)

        msg = asynqp.Message(
            {
                'task_id': self.task_id,
                'status': self.status,
                'progress': self.progress,
                'text': self.text,
                'new_stdout': new_stdout,
                'new_stderr': ""
            }
        )

        await self.exchange_lock.acquire()
        self.exchange.publish(msg, 'tasks_statuses')
        self.exchange_lock.release()

    async def append_stderr(self, new_stderr):
        new_stderr = new_stderr
        Task.append_stderr(self, new_stderr)

        msg = asynqp.Message(
            {
                'task_id': self.task_id,
                'status': self.status,
                'progress': self.progress,
                'text': self.text,
                'new_stdout': "",
                'new_stderr': new_stderr
            }
        )

        await self.exchange_lock.acquire()
        self.exchange.publish(msg, 'tasks_statuses')
        self.exchange_lock.release()
