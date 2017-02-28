""" Async class for Task"""
import asynqp
from black.db import sessions, models
from black.workers.common.task import Task


class AsyncTask(object):
    """ Async class for the task """

    def __init__(self, task_id, task_type, target, params, project_name):
        # ID returned from the queue
        self.task_id = task_id

        # Name of the task (nmap, dnsscan ...)
        self.task_type = task_type

        # Target of the task
        self.target = target

        # Special parameters
        self.params = params

        # Project, on which the task has been launched
        self.project_name = project_name

        # Point to the object of ORM
        self.db_object = None

        # Here is the only difference in the Sync/Async init
        # self.create_db_record()

        # Points the the asyncio.Process object 
        #   (if the task is launched via Popen)
        # Otherwise nothing
        self.proc = None

        # Keep track of the data
        self.stdout = None
        self.stderr = None
        self.exit_code = None        

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

        self.create_db_record()
