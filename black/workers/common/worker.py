""" Basic worker """
class Worker(object):

    """Worker keeps track of new tasks on the redis channel and
    launches them in the background.
    Another redis channel is monitored for all notifications.
    If any, process them ASAP."""

    def __init__(self, worker_name, task_class):
        # Queue for receiving tasks
        self.tasks_queue = None

        # Queue for receiving notifications
        self.notifications_queue = None

        self.active_processes = list()
        self.finished_processes = list()
        self.name = worker_name

        self.task_class = task_class

    def initialize(self):
        """ Init variables """
        # Connect to the RabbitMQ broker
        # Open a communications channel
        # Create an exchange on the broker
        # Create two queues on the exchange
        # Bind the queue to the exchange, so the queue will get messages published to the exchange
        pass

    def acquire_resources(self):
        """ Function that captures resources, now it is just a semaphore """
        pass

    def release_resources(self):
        """ Function that releases resources, now it is just a semaphore """
        pass


    def start_tasks_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        pass


    def handle_finished_task(self, proc):
        """ After the task is finished, remove it from 'active' list """
        pass

    def start_notifications_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        pass

    def handle_notification(self, message):
        """ Handle the notification, just received. """
        pass
