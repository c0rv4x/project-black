""" Basic worker """
import asyncio
import asynqp

from .worker import Worker


class AsyncWorker(Worker):

    """Worker keeps track of new tasks on the redis channel and
    launches them in the background.
    Another redis channel is monitored for all notifications.
    If any, process them ASAP."""

    def __init__(self, worker_name, task_class):
        Worker.__init__(self, worker_name, task_class)
        self.semaphore = asyncio.Semaphore(value=3)

    async def initialize(self):
        """ Init variables """
        # connect to the RabbitMQ broker
        connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

        # Open a communications channel
        channel = await connection.open_channel()

        # Create an exchange on the broker
        exchange = await channel.declare_exchange('tasks.exchange', 'direct')

        # Create two queues on the exchange
        self.tasks_queue = await channel.declare_queue(self.name + '_tasks')
        self.notifications_queue = await channel.declare_queue(self.name + '_notifications')

        # Bind the queue to the exchange, so the queue will get messages published to the exchange
        await self.tasks_queue.bind(exchange, routing_key=self.name + '_tasks')
        await self.notifications_queue.bind(exchange, routing_key=self.name + '_notifications')

    async def acquire_resources(self):
        """ Function that captures resources, now it is just a semaphore """
        await self.semaphore.acquire()

    def release_resources(self):
        """ Function that releases resources, now it is just a semaphore """
        self.semaphore.release()


    async def start_tasks_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        await self.tasks_queue.consume(self.schedule_task)

    def schedule_task(self, message):
        """ Wrapper of execute_task that puts the task to the event loop """
        loop = asyncio.get_event_loop()
        loop.create_task(self.execute_task(message))

    async def execute_task(self, message):
        """ Method launches the task execution, remembering the
            processes's object. """
        await self.acquire_resources()
        message.ack()

        try:
            # Add a unique id to the task, so we can track the notifications
            # which are addressed to the ceratin task
            message = message.json()

            task_id = message['task_id']
            target = message['target']
            params = message['params']
            project_uuid = message['project_uuid']

            # Spawn the process
            proc = self.task_class(task_id, target, params, project_uuid)
            await proc.initialize()
            await proc.start()

            # Store the object that points to the process
            self.active_processes.append(proc)

            # Wait till finishing the task
            await proc.wait_for_exit()

            # Do some finalization
            self.handle_finished_task(proc)
        except Exception as e:
            print("++++++++++++ Async_worker.py:execute_task ~ " + str(e))

            self.release_resources()


    def handle_finished_task(self, proc):
        """ After the task is finished, remove it from 'active' list """
        self.active_processes.remove(proc)
        self.finished_processes.append(proc)

        self.release_resources()


    async def start_notifications_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        await self.notifications_queue.consume(self.handle_notification)

    def handle_notification(self, message):
        """ Handle the notification, just received. """
        print("Notification received")
        # Add a unique id to the task, so we can track the notifications
        # which are addressed to the ceratin task
        message.ack()
        message = message.json()
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
            raise Exception("Mess with the queues")
