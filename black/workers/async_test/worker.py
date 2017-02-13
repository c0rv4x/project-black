import os
import asyncio
import aioredis
from time import sleep

from concurrent.futures._base import TimeoutError

from asyncio.subprocess import PIPE


class Worker(object):

    """Worker keeps track of new tasks on the redis channel and 
    launches them in the background.
    Another redis channel is monitored for all notifications.
    If any, process them ASAP."""

    def __init__(self, worker_name):
        # Channel (queue) for receiving tasks
        self.tasks_channel = None

        # Channel (queue) for receiving notifications
        self.notifications_channel = None

        self.active_processes = list()
        self.finished_processes = list()
        self.name = worker_name

    async def initialize(self):
        """ Init variables and run queues checkers """
        # Create connect to redis
        connection = await aioredis.create_redis(('localhost', 6379))

        # Subscribe to the channel 'nmap_tasks'
        subscription_result = await connection.psubscribe(self.name +'_tasks')

        # Remember the channel
        self.tasks_channel = subscription_result[0]

        # Subscribe to the channel 'nmap_notifications'
        subscription_result = await connection.psubscribe(self.name + '_notifications')

        # Remember the channel
        self.notifications_channel = subscription_result[0]

    async def process_tasks_queue(self):
        """ Check if tasks queue has any data. 
        If any, launch the tasks execution """
        try:
            # Try to read data from queue with a timeout
            msg = await asyncio.wait_for(self.tasks_channel.get_json(), 1)
        except TimeoutError as e:
            print("[Task] Timeout")
        else:
            await self.start_task(msg)

    async def process_notifications_queue(self):
        """ Check if notifications queue has any data.
        If any, launch the notifications execution """
        try:
            # Try to read data from queue with a timeout
            msg = await asyncio.wait_for(self.notifications_channel.get_json(), 1)
        except TimeoutError as e:
            print("[Notif] Timeout")
        else:
            await self.start_notifications(msg)

    async def update_active_processes(self):
        """ Check all the running processes and see if any has finished(terminated) """
        pass

    async def process_queues(self):
        """ Infinite loop for processing both queues """
        # Check that we have not exceeded the limit
        if len(self.active_processes) < 3:
            await self.process_tasks_queue()
        else:
            print("Too many processes have been run at this time")

        # Check the notifications queue
        await self.process_notifications_queue()

        # Update processes list
        await self.update_active_processes()

        # Infinite loop
        await self.process_queues()

    async def start_task(self, message):
        """ Method launches the task execution, remembering the 
            processes's object. """
        pass

    async def start_notification(self, command):
        """ Method launches the notification execution, remembering the 
            processes's object. """
        pass


