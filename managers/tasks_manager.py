import pika
import uuid

from black.black.db import sessions, Task


class ShadowTask(object):
    """ A shadow of the real task """
    def __init__(self, task_type, target, params, project_uuid):
        self.task_type = task_type
        self.target = target
        self.params = params
        self.project_uuid = project_uuid

        self.task_id = str(uuid.uuid4())

        self.channel = None

        """ Init variables """
        # connect to the RabbitMQ broker
        credentials = pika.PlainCredentials('guest', 'guest')
        parameters = pika.ConnectionParameters('localhost', credentials=credentials)
        connection = pika.BlockingConnection(parameters)

        # Open a communications channel
        self.channel = connection.channel()
        self.channel.exchange_declare(
            exchange="tasks.exchange",
            exchange_type="direct",
            durable=True)
        self.channel.queue_declare(queue=self.task_type + "_tasks", durable=True)
        self.channel.queue_bind(
            queue=self.task_type + "_tasks",
            exchange="tasks.exchange",
            routing_key=self.task_type + "_tasks") 


        self.status = None
        self.progress = None

    def set_status(self, new_status):
        self.status = new_status

    def set_progress(self, new_progress):
        self.progress = new_progress

    def get_status(self):
        return self.status

    def get_progress(self):
        return self.progress


class TaskManager(object):
    """ TaskManager keeps track of all tasks in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.active_tasks = list()
        self.finished_tasks = list()

        self.update_from_db()

    def update_from_db(self):
        """ Extract all the tasks from the DB """
        session = sessions.get_new_session()
        tasks_from_db = session.query(Task).all()
        
        tasks = list(map(lambda x: 
                ShadowTask(x.task_id,
                           x.task_type,
                           x.target,
                           x.params,
                           x.status,
                           x.project_uuid),
                     tasks_from_db))
        sessions.destroy_session(session)

        for task in tasks:
            if task.get_status() == 'Finished':
                self.finished_tasks.append(task)
            else:
                self.active_tasks.append(task)

    def get_tasks(self):
        return [self.active_tasks, self.finished_tasks]

    def get_tasks_native_objects(self):
        active = list(map(lambda x: {
            "task_id" : x.task_id,
            "task_type" : x.task_type,
            "target" : x.target,
            "params" : x.params,
            "status" : x.status,
            "project_uuid" : x.project_uuid
        }, self.active_tasks))

        finished = list(map(lambda x: {
            "task_id" : x.task_id,
            "task_type" : x.task_type,
            "target" : x.target,
            "params" : x.params,
            "status" : x.status,
            "project_uuid" : x.project_uuid
        }, self.finished_tasks))

        return [active, finished]    

    def create_task(self, task_type, target, params, project_uuid):
        task = ShadowTask(task_type, target, params, project_uuid)
        self.active_tasks.append(task)
