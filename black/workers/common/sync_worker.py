""" Basic worker """
import json
import threading
import multiprocessing
from time import sleep

from .worker import Worker
from .sync_consumer import SyncConsumer


class SyncWorker(Worker):

    """Worker keeps track of new tasks on the redis channel and
    launches them in the background.
    Another redis channel is monitored for all notifications.
    If any, process them ASAP."""

    def __init__(self, worker_name, task_class):
        Worker.__init__(self, worker_name, task_class)
        self.semaphore = threading.Semaphore(value=30)
        self.channel = None

    def initialize(self):
        """ Init variables """
        self.tasks_consumer = SyncConsumer(self.name + "_tasks", self.name + "_tasks")
        self.tasks_consumer.add_consumer_handler(self.schedule_task)

        self.notifications_consumer = SyncConsumer(self.name + "_notifications", self.name + "_notifications")
        self.notifications_consumer.add_consumer_handler(self.handle_notification)

    def acquire_resources(self):
        """ Function that captures resources, now it is just a semaphore """
        self.semaphore.acquire()

    def release_resources(self):
        """ Function that releases resources, now it is just a semaphore """
        self.semaphore.release()

    def start_tasks_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        p = multiprocessing.Process(target=self.tasks_consumer.run)
        p.start()

    def schedule_task(self, body):
        """ Wrapper of execute_task that puts the task to the event loop """
        self.acquire_resources()
        thread = threading.Thread(target=self.execute_task, args=(body,))
        thread.start()

    def execute_task(self, message):
        """ Method launches the task execution, remembering the
            processes's object. """
        # Add a unique id to the task, so we can track the notifications
        # which are addressed to the ceratin task
        try:
            message = message.decode('utf-8')
            message = json.loads(message)
        except Exception as e:
            message = json.loads(message)

        task_id = message['task_id']
        target = message['target']
        params = message['params']
        project_uuid = message['project_uuid']

        # Spawn the process
        proc = self.task_class(task_id, target, params, project_uuid)

        # Store the object that points to the process
        self.active_processes.append(proc)

        try:
            # Launch
            proc.start()
        except Exception as e:
            pass
        finally:
            # Wait till finishing the task
            proc.wait_for_exit()

            # Do some finalization
            self.handle_finished_task(proc)

    def handle_finished_task(self, proc):
        """ After the task is finished, remove it from 'active' list """
        proc.finish()
        self.active_processes.remove(proc)
        self.finished_processes.append(proc)

        self.release_resources()


    def start_notifications_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        p = multiprocessing.Process(target=self.notifications_consumer.run)
        p.start()


    def handle_notification(self, body):
        """ Handle the notification, just received. """
        print("Notification received")
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

        while True:
            sleep(2)
