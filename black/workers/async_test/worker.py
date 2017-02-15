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

    def __init__(self, worker_name, process_class):
        # Channel (queue) for receiving tasks
        self.tasks_channel = None

        # Channel (queue) for receiving notifications
        self.notifications_channel = None

        self.active_processes = list()
        self.finished_processes = list()
        self.name = worker_name

        self.process_class = process_class

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
            # print("[Task] Timeout")
            pass
        else:
            await self.start_task(msg)

    async def process_notifications_queue(self):
        """ Check if notifications queue has any data.
        If any, launch the notifications execution """
        try:
            # Try to read data from queue with a timeout
            msg = await asyncio.wait_for(self.notifications_channel.get_json(), 1)
        except TimeoutError as e:
            # print("[Notif] Timeout")
            pass
        else:
            await self.start_notification(msg)
            await self.process_notifications_queue()

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

    async def update_active_processes(self):
        """ Check all the running processes and see if any has finished(terminated) """
        # Remember, which processes should be removed from the list of active processes
        to_remove = list()

        for i in range(0, len(self.active_processes)):
            proc = self.active_processes[i]

            # Ask the process instance if he has exited
            if await proc.check_if_exited():
                # If so, move it from the list of active processes to the inactive list
                self.finished_processes.append(proc)
                to_remove.append(i)

        # Remove finished/terminated tasks from the list of active tasks
        if to_remove:
            for i in reversed(to_remove):
                self.active_processes.pop(i)

    async def start_task(self, message):
        """ Method launches the task execution, remembering the 
            processes's object. """

        # Add a unique tag to the task, so we can track the notifications 
        # which are addressed to the ceratin task
        message = message[1]
        task_id = message['task_id']
        command = message['command']

        # Spawn the process
        # proc = await asyncio.create_subprocess_shell(command)
        proc = self.process_class(task_id, command)
        await proc.start()

        # Store the object that points to the process
        self.active_processes.append(proc)

    async def start_notification(self, message):
        """ Method launches the notification execution, remembering the 
            processes's object. """
        message = message[1]
        task_id = message['task_id']
        command = message['command']

        for process in self.active_processes:
            tag = process.get_id()

            if tag == task_id:
                await process.process_notification(command)
