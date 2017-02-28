""" Sync class for Task"""
from black.db import sessions, models
from black.workers.common.task import Task


class SyncTask(Task):
    """ Sync class for the task """

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
        self.create_db_record()

        # Keep track of the data
        self.stdout = None
        self.stderr = None
        self.exit_code = None        

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
        self.channel.queue_declare(queue=self.task_id, durable=True, auto_delete=True)
        self.channel.queue_bind(
            queue=self.task_id,
            exchange="tasks.exchange",
            routing_key=self.task_id)