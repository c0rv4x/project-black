""" Async class for Task"""
import json
import aio_pika
from asyncio import Lock, get_event_loop
from black.db import sessions
from black.workers.common.task import Task

from config import CONFIG


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
        self.connection = await aio_pika.connect_robust(
            "amqp://{}:{}@{}:{}/".format(
                CONFIG['rabbit']['username'],
                CONFIG['rabbit']['password'],
                CONFIG['rabbit']['host'],
                CONFIG['rabbit']['port']
            ), loop=get_event_loop()
        )

        # Open a communications channel
        self.channel = await self.connection.channel()

        # Create an exchange on the broker
        self.exchange = await self.channel.declare_exchange(
            'tasks.exchange',
            durable=True
        )

        # Create queues on the exchange
        queue = await self.channel.declare_queue(
            'tasks_statuses',
            durable=True
        )
        await queue.bind(
            self.exchange,
            routing_key='tasks_statuses'
        )

        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self.channel.close()
        await self.connection.close()

    async def initialize(self):
        self.exchange_lock = Lock()

        await self.set_status("New")

    async def set_status(self, new_status, progress=0, text=""):
        Task.set_status(self, new_status, progress=progress, text=text)

        msg = aio_pika.Message(
            body=json.dumps({
                'task_id': self.task_id,
                'status': new_status,
                'progress': progress,
                'text': text,
                'new_stdout': "",
                'new_stderr': ""
            }).encode()
        )

        await self.exchange_lock.acquire()
        await self.exchange.publish(msg, 'tasks_statuses')
        self.exchange_lock.release()

    async def append_stdout(self, new_stdout):
        Task.append_stdout(self, new_stdout)

        msg = aio_pika.Message(
            body=json.dumps({
                'task_id': self.task_id,
                'status': self.status,
                'progress': self.progress,
                'text': self.text,
                'new_stdout': new_stdout,
                'new_stderr': ""
            }).encode()
        )

        await self.exchange_lock.acquire()
        await self.exchange.publish(msg, 'tasks_statuses')
        self.exchange_lock.release()

    async def append_stderr(self, new_stderr):
        Task.append_stderr(self, new_stderr)

        msg = aio_pika.Message(
            body=json.dumps({
                'task_id': self.task_id,
                'status': self.status,
                'progress': self.progress,
                'text': self.text,
                'new_stdout': "",
                'new_stderr': new_stderr
            }).encode()
        )

        await self.exchange_lock.acquire()
        await self.exchange.publish(msg, 'tasks_statuses')
        self.exchange_lock.release()
