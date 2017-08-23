""" This module contains functionality, that is responsible for managing tasks """
import uuid
import json
import threading
import datetime
import pika

from black.black.db import sessions, Task


class ShadowTask(object):
    """ A shadow of the real task """
    def __init__(self, task_id, task_type, target, params, project_uuid, status="New", progress=None, text=None, date_added=datetime.datetime.utcnow(), stdout="", stderr="", channel=None):
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
        self.date_added = date_added
        self.stdout = stdout
        self.stderr = stderr

        self.channel = channel

        # This variable keeps information whether the corresponding task
        # should be sent back to the web.
        self.new_status_known = False


    def send_start_task(self):
        """ Put a message to the queue, which says "start my task, please """
        print("Literally sendin start task", self.task_id, self.target)
        self.channel.basic_publish(exchange='',
                                   routing_key=self.task_type + "_tasks",
                                   body=json.dumps({
                                       'task_id': self.task_id,
                                       'target': self.target,
                                       'params': self.params,
                                       'project_uuid': self.project_uuid
                                   }))


    def set_status(self, new_status, progress, text, new_stdout, new_stderr):
        """ Change status, progress and text of the task """
        self.status = new_status
        self.progress = progress
        self.text = text
        self.stdout += new_stdout
        self.stderr += new_stderr

    def get_status(self):
        """ Returns a tuple of status, progress and text of the task"""
        return (self.status, self.progress, self.text)

    def get_as_native_object(self, grab_file_descriptors=False):
        """ "Serialize" the task to python native dict """
        if grab_file_descriptors:
            if self.status == 'Finished' or self.status == 'Aborted':
                return {
                    "task_id" : self.task_id,
                    "task_type" : self.task_type,
                    "target" : self.target,
                    "params" : self.params,
                    "status" : self.status,
                    "progress" : self.progress,
                    "text" : self.text,
                    "project_uuid" : self.project_uuid,
                    "stdout" : self.stdout,
                    "stderr" : self.stderr,
                    "date_added": str(self.date_added)
                }

        return {
            "task_id" : self.task_id,
            "task_type" : self.task_type,
            "target" : self.target,
            "params" : self.params,
            "status" : self.status,
            "progress" : self.progress,
            "text" : self.text,
            "project_uuid" : self.project_uuid,
            # "stdout" : self.stdout,
            # "stderr" : self.stderr,
            "date_added": str(self.date_added)
        }


class TaskManager(object):
    """ TaskManager keeps track of all tasks in the system,
    exposing some interfaces for public use. """
    def __init__(self, data_updated_queue):
        self.data_updated_queue = data_updated_queue

        self.active_tasks = list()
        self.finished_tasks = list()

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

        self.spawn_all_channels_with_queues()

        self.update_from_db()


        thread = threading.Thread(target=self.channel.start_consuming)
        thread.start()

    def spawn_all_channels_with_queues(self):
        for task_type in ['nmap','dnsscan','dirseach', 'dnsscan']:
            self.channel.exchange_declare(
                exchange="tasks.exchange",
                exchange_type="direct",
                durable=True)
            self.channel.queue_declare(queue=task_type + "_tasks", durable=True)
            self.channel.queue_bind(
                queue=task_type + "_tasks",
                exchange="tasks.exchange",
                routing_key=task_type + "_tasks")

            self.channel.queue_declare(queue=task_type + "_notifications", durable=True)
            self.channel.queue_bind(
                queue=task_type + "_notifications",
                exchange="tasks.exchange",
                routing_key=task_type + "_notifications")

    def check_finished_task_necessities(self, task):
        """ After the task finishes, we need to check, whether we should push 
        some new changes to the front end """
        if task.task_type == "dirsearch": 
            self.data_updated_queue.put(("file", task.project_uuid))
        elif task.task_type == "masscan" or task.task_type == "nmap":
            self.data_updated_queue.put(("scan", task.project_uuid))
        elif task.task_type == "dnsscan":
            self.data_updated_queue.put(("scope", task.project_uuid))

    def parse_new_status(self, channel, method, properties, message):
        """ Parse the message from the queue, which contains task status,
        updates the relevant ShadowTask and, we notify the upper module that
        it must update the scan results. """
        try:
            message = message.decode('utf-8')
            message = json.loads(message)
        except Exception as e:
            message = json.loads(message)
        task_id = message['task_id']
        print("Message:",message)

        for task in self.active_tasks:
            if task.task_id == task_id:
                new_status = message['status']
                new_progress = message['progress']
                new_text = message['text']
                new_stdout = message['new_stdout']
                new_stderr = message['new_stderr']

                if new_status != task.status or new_progress != task.progress:
                    print("Were not known before", task_id, new_status, new_progress)
                    task.new_status_known = False

                task.set_status(new_status, new_progress, new_text, new_stdout, new_stderr)

                if new_status == 'Finished' or new_status == 'Aborted':
                    self.active_tasks.remove(task)
                    self.finished_tasks.append(task)

                    # TODO: make more granular update request
                    self.check_finished_task_necessities(task)

                break

        channel.basic_ack(delivery_tag=method.delivery_tag)

    def update_from_db(self):
        """ Extract all the tasks from the DB """
        session = sessions.get_new_session()
        tasks_from_db = session.query(Task).all()
        tasks = list(map(lambda x:
                         ShadowTask(task_id=x.task_id,
                                    task_type=x.task_type,
                                    target=json.loads(x.target),
                                    params=json.loads(x.params),
                                    project_uuid=x.project_uuid,
                                    status=x.status,
                                    progress=x.progress,
                                    text=x.text,
                                    date_added=x.date_added,
                                    stdout=x.stdout,
                                    stderr=x.stderr,
                                    channel=self.channel),
                         tasks_from_db))
        sessions.destroy_session(session)

        for task in tasks:
            status = task.get_status()[0]
            if status == 'Finished' or status == 'Aborted':
                self.finished_tasks.append(task)
            else:
                self.active_tasks.append(task)

    def get_tasks(self):
        """ Returns a list of active tasks and a list of finished tasks """
        return [self.active_tasks, self.finished_tasks]

    def get_tasks_native_objects(self, project_uuid=None, get_all=False):
        """ "Serializes" tasks to native python dicts """
        active_filtered = list(filter(
            lambda x: project_uuid is None or x.project_uuid == project_uuid,
            self.active_tasks))
        finished_filtered = list(filter(
            lambda x: project_uuid is None or x.project_uuid == project_uuid,
            self.finished_tasks))

        if get_all:
            active = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), active_filtered))
            finished = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), finished_filtered))

            return {
                'active': active,
                'finished': finished
            }
        else:
            active = list(filter(lambda x: x.new_status_known == False, active_filtered))
            finished = list(filter(lambda x: x.new_status_known == False, finished_filtered))
            for each_task in active:
                each_task.new_status_known = True

            for each_task in finished:
                each_task.new_status_known = True

            active_objects = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), active))
            finished_objects = list(map(lambda x: x.get_as_native_object(grab_file_descriptors=False), finished))

            return {
                'active': active_objects, 
                'finished': finished_objects
            }            


    def create_task(self, task_type, target, params, project_uuid):
        """ Register the task and send a command to start it """
        task = ShadowTask(task_id=None,
                          task_type=task_type,
                          target=target,
                          params=params,
                          project_uuid=project_uuid,
                          channel=self.channel)
        print("task_manager creating", target, project_uuid)
        task.send_start_task()
        self.active_tasks.append(task)

        return task.get_as_native_object(grab_file_descriptors=False)
