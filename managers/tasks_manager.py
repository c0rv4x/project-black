import pika
import uuid
import json
import threading

from black.black.db import sessions, Task


class ShadowTask(object):
    """ A shadow of the real task """
    def __init__(self, task_id, task_type, target, params, project_uuid, status=None, progress=None, text=None):
        self.task_type = task_type
        self.target = target
        self.params = params
        self.project_uuid = project_uuid

        if task_id:
            self.task_id = task_id
        else:
            self.task_id = str(uuid.uuid4())

        self.status = status
        self.progress = progress
        self.text = text


        self.channel = None

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

        self.channel.queue_declare(queue=self.task_type + "_notifications", durable=True)
        self.channel.queue_bind(
            queue=self.task_type + "_notifications",
            exchange="tasks.exchange",
            routing_key=self.task_type + "_notifications") 


    def send_start_task(self):
        self.channel.basic_publish(exchange='',
                                   routing_key=self.task_type + "_tasks",
                                   body=json.dumps({
                                      'task_id': self.task_id,
                                      'target': self.target,
                                      'params': {
                                         'program': ['-p80-1000']
                                      },
                                      'project_uuid': self.project_uuid
                                   }))


    def set_status(self, new_status, progress, text):
        self.status = new_status
        self.progress = progress
        self.text = text

    def get_status(self):
        return (self.status, self.progress, self.text)

    def get_as_native_object(self):
        return {
            "task_id" : self.task_id,
            "task_type" : self.task_type,
            "target" : self.target,
            "params" : self.params,
            "status" : self.status,
            "progress" : self.progress,
            "text" : self.text,
            "project_uuid" : self.project_uuid
        }

class TaskManager(object):
    """ TaskManager keeps track of all tasks in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.active_tasks = list()
        self.finished_tasks = list()

        self.update_from_db()

        self.channel = None

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

        self.channel.queue_declare(queue="tasks_statuses", durable=True)
        self.channel.queue_bind(
            queue="tasks_statuses",
            exchange="tasks.exchange",
            routing_key="tasks_statuses")

        self.channel.basic_consume(
            consumer_callback=self.parse_new_status,
            queue="tasks_statuses")

        t = threading.Thread(target=self.channel.start_consuming)
        t.start()

    def parse_new_status(self, ch, method, properties, message):
        message = json.loads(message)
        task_id = message['task_id']

        for task in self.active_tasks:
            if task.task_id == task_id:
                task.set_status(message['status'], message['progress'], message['text'])
                break

        ch.basic_ack(delivery_tag=method.delivery_tag)        

    def update_from_db(self):
        """ Extract all the tasks from the DB """
        session = sessions.get_new_session()
        tasks_from_db = session.query(Task).all()
        print(tasks_from_db[0].progress)
        print(tasks_from_db[1].progress)
        tasks = list(map(lambda x: 
                ShadowTask(task_id=x.task_id,
                           task_type=x.task_type,
                           target=x.target,
                           params=x.params,
                           project_uuid=x.project_uuid,
                           status=x.status,
                           progress=x.progress,
                           text=x.text),
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
        active = list(map(lambda x: x.get_as_native_object(), self.active_tasks))
        finished = list(map(lambda x: x.get_as_native_object(), self.finished_tasks))

        return [active, finished]    

    def create_task(self, task_type, target, params, project_uuid):
        task = ShadowTask(task_id=None,
                          task_type=task_type,
                          target=target,
                          params=params,
                          project_uuid=project_uuid,
                          status=None,
                          progress=None,
                          text=None)
        task.send_start_task()
        self.active_tasks.append(task)

        return task.get_as_native_object()
