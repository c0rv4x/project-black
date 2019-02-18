""" Basic worker """
import json
import asyncio
import aio_pika

from .worker import Worker
from config import CONFIG


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
        connection = await aio_pika.connect_robust(
            "amqp://{}:{}@{}:{}/".format(
                CONFIG['rabbit']['username'],
                CONFIG['rabbit']['password'],
                CONFIG['rabbit']['host'],
                CONFIG['rabbit']['port']
            ), loop=asyncio.get_event_loop()
        )

        # Open a communications channel
        channel = await connection.channel()

        # Create an exchange on the broker
        exchange = await channel.declare_exchange(
            'tasks.exchange',
            durable=True
        )

        # Create two queues on the exchange
        self.tasks_queue = await channel.declare_queue(
            self.name + '_tasks',
            durable=True
        )
        await self.tasks_queue.bind(exchange, self.name + '_tasks')

        self.notifications_queue = await channel.declare_queue(
            self.name + '_notifications',
            durable=True
        )
        await self.notifications_queue.bind(exchange, self.name + '_notifications')

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

    async def execute_task(self, raw_message):
        """ Method launches the task execution, remembering the
            processes's object. """
        await self.acquire_resources()
        raw_message.ack()

        try:
            # Add a unique id to the task, so we can track the notifications
            # which are addressed to the ceratin task
            message = json.loads(raw_message.body)

            task_id = message['task_id']
            target = message['target']
            params = message['params']
            project_uuid = message['project_uuid']

            # Spawn the process
            async with self.task_class(
                task_id, target, params, project_uuid
            ) as proc:
                await proc.initialize()
                await proc.start()

                # Store the object that points to the process
                self.active_processes.append(proc)

                # Wait till finishing the task
                await proc.wait_for_exit()

                # Do some finalization
                self.handle_finished_task(proc)
        except Exception as exc:
            print("[!!]Generic class for tasks caught exception: " + str(exc))

            self.release_resources()

    def handle_finished_task(self, proc):
        """ After the task is finished, remove it from 'active' list """
        self.active_processes.remove(proc)
        # self.finished_processes.append(proc)

        self.release_resources()

    async def start_notifications_consumer(self):
        """ Check if tasks queue has any data.
        If any, launch the tasks execution """
        await self.notifications_queue.consume(self.schedule_command)

    def schedule_command(self, message):
        """ Wrapper of execute_task that puts the task to the event loop """
        loop = asyncio.get_event_loop()
        loop.create_task(self.handle_notification(message))

    async def handle_notification(self, raw_message):
        """ Handle the notification, just received. """
        # Add a unique id to the task, so we can track the notifications
        # which are addressed to the ceratin task
        raw_message.ack()
        message = json.loads(raw_message.body)
        task_id = message['task_id']
        command = message['command']

        for proc in self.active_processes:
            if proc.get_id() == task_id:
                print("Found process for {}, sending".format(command))
                await proc.handle_command(command)

                break

        # if not sent:
        #     for proc in self.finished_processes:
        #         if proc.get_id() == task_id:
        #             print("Now sending")
        #             proc.handle_command(command)
        #             sent = True

    async def stop(self):
        """ Stops the worker, aborting all the tasks """
        for task in self.active_processes:
            await task.cancel()