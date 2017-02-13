import asyncio
import aioredis
from time import sleep

from concurrent.futures._base import TimeoutError as TimeoutError

from asyncio.subprocess import PIPE


class Worker(object):

    """Worker keeps track of new tasks on the redis channel and 
    launches them in the background.
    Another redis channel is monitored for all notifications.
    If any, process them ASAP."""

    def __init__(self):
        self.tasks_channel = None
        self.notifications_channel = None
        self.active_processes = list()

    async def init(self):
        """ Init variables and run queues checkers """
        # Create connect to redis
        connection = await aioredis.create_redis(('localhost', 6379))

        # Subscribe to the channel 'nmap_tasks'
        subscription_result = await connection.psubscribe('nmap_tasks')

        # Remember the channel
        self.tasks_channel = subscription_result[0]

        # Subscribe to the channel 'nmap_notifications'
        subscription_result = await connection.psubscribe('nmap_notifications')

        # Remember the channel
        self.notifications_channel = subscription_result[0]


    async def process_tasks_queue(self):
        """ Check if tasks queue has any data. If any, launch the tasks execution """
        try:
            # Try to read data from queue with a timeout
            msg = await asyncio.wait_for(self.tasks_channel.get_json(), 1)
        except TimeoutError as e:
            # Timeout of the queue consuming occured
            print("[Tasks] Timeout")

            # Proceed to the notifications queue parsing
            # await self.process_tasks_queue()
        else:
            # Launch the tasks execution
            await self.start_task(msg)


    async def process_notifications_queue(self):
        """ Check if notifications queue has any data. If any, launch the notifications execution """
        try:
            # Try to read data from queue with a timeout
            msg = await asyncio.wait_for(self.notifications_channel.get_json(), 1)
        except TimeoutError as e:
            # Timeout of the queue consuming occured
            print("[notifications] Timeout")

            # Proceed to the notifications queue parsing
            # await self.process_notifications_queue()
        else:
            # Launch the notifications execution
            await self.start_notifications(msg)


    async def start_task(self, command="sleep 3; curl -i ya.ru"):
        """ Method launches the task execution, remembering the 
            processes's object. """
        # Spawn the process
        proc = await asyncio.create_subprocess_shell("sleep 3; curl -i ya.ru",
                                                     stdin=PIPE,
                                                     stdout=PIPE)

        # Store the object that points to the process
        self.active_processes.append(proc)

        print("pid: %s" % proc.pid)

    async def start_notification(self, command):
        """ Method launches the notification execution, remembering the 
            processes's object. """
        print("Looks like notification has been processed")

    async def process_queues(self):
        """ Infinite loop for processing both queues """
        # Check that we have not exceeded the limit
        if len(self.active_processes) < 3:
            await self.process_tasks_queue()
        else:
            print("Too many processes have been run at this time")

        # Check the notifications queue
        await self.process_notifications_queue()

        await self.process_queues()

    # async def process_task(self, proc):
    #     try:
    #         stdout, stderr = await asyncio.wait_for(proc.communicate(), 1)
    #     except Exception as e:
    #         await self.process_task(proc)
    #     else:
    #         print("nmap read: %r" % stdout.decode('ascii'))
    #         exitcode = await proc.wait()
    #         print("(exit code %s)" % exitcode)


loop = asyncio.get_event_loop()
worker = Worker()
loop.run_until_complete(worker.init())
loop.run_until_complete(worker.process_queues())
