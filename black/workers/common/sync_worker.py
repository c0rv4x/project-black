""" Basic worker """
import json
import threading
import pika

from .worker import Worker


class SyncWorker(Worker):

    """Worker keeps track of new tasks on the redis channel and
    launches them in the background.
    Another redis channel is monitored for all notifications.
    If any, process them ASAP."""

    def __init__(self, worker_name, task_class):
        Worker.__init__(self, worker_name, task_class)
        self.semaphore = threading.Semaphore(value=3)
        self.channel = None

    def initialize(self):
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
        self.channel.queue_declare(queue=self.name + "_tasks", durable=True)
        self.channel.queue_bind(
            queue=self.name + "_tasks",
            exchange="tasks.exchange",
            routing_key=self.name + "_tasks")

    def acquire_resources(self):
        """ Function that captures resources, now it is just a semaphore """
        self.semaphore.acquire()

    def release_resources(self):
        """ Function that releases resources, now it is just a semaphore """
        self.semaphore.release()

    def produce_sample(self):
        """ Quick funcitons for submitting a task sample """
        from uuid import uuid4
        task_id = self.name + "_task_" + str(uuid4())
        msg = {"task_id": task_id, "target": "hey", "parameters": ["some params"], "project_uuid": "test_project"}
        self.channel.basic_publish(exchange='tasks.exchange',
                                   routing_key=self.name + '_tasks',
                                   body=json.dumps(msg),
                                   properties=pika.BasicProperties(content_type='application/json'))

    def start_tasks_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        self.channel.basic_consume(
            consumer_callback=self.schedule_task,
            queue=self.name + '_tasks')

    def schedule_task(self, something, method, properties, body):
        """ Wrapper of execute_task that puts the task to the event loop """
        print("Got msg {}".format(body))
        self.channel.basic_ack(delivery_tag=method.delivery_tag)

        self.acquire_resources()
        print("Enough resources on {}".format(body))
        thread = threading.Thread(target=self.execute_task, args=(body,))
        thread.start()

    def execute_task(self, message):
        """ Method launches the task execution, remembering the
            processes's object. """
        # Add a unique id to the task, so we can track the notifications
        # which are addressed to the ceratin task
        message = json.loads(message)
        task_id = message['task_id']
        target = message['target']
        params = message['params']
        project_uuid = message['project_uuid']

        # Spawn the process
        proc = self.task_class(task_id, target, params, project_uuid)

        # Store the object that points to the process
        self.active_processes.append(proc)

        # Launch
        proc.start()

        # Wait till finishing the task
        proc.wait_for_exit()

        # Do some finalization
        self.handle_finished_task(proc)

    def handle_finished_task(self, proc):
        """ After the task is finished, remove it from 'active' list """
        self.active_processes.remove(proc)
        self.finished_processes.append(proc)

        print("Releasing resources")
        self.release_resources()


    def start_notifications_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        self.channel.basic_consume(
            consumer_callback=self.handle_notification,
            queue=self.name + '_notifications')

    def handle_notification(self, something, method, properties, body):
        """ Handle the notification, just received. """
        print("Notification received")
        self.channel.basic_ack(delivery_tag=method.delivery_tag)
        # Add a unique id to the task, so we can track the notifications
        # which are addressed to the ceratin task
        message = json.loads(body)
        task_id = message['task_id']
        command = message['command']
        sent = False
        for proc in self.active_processes:
            if proc.get_id() == task_id:
                print("Now sending")
                proc.send_notification(command)
                sent = True

        if not sent:
            for proc in self.finished_processes:
                if proc.get_id() == task_id:
                    print("Now sending")
                    proc.send_notification(command)
                    sent = True
        if not sent:
            print("Mess with the queues: notification destination not found")

    def start_consuming(self):
        """ Launch both queues and start consuming """
        self.start_tasks_consumer()
        self.start_notifications_consumer()
        self.channel.start_consuming()
