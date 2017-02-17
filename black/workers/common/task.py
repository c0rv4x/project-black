import signal
import asyncio
import aioredis
from concurrent.futures._base import TimeoutError


class Task(object):
    """ Base class for the task """

    def __init__(self, process_id, command):
        # ID returned from the queue
        self.id = process_id

        # Command, just for the record
        self.command = command
        self.status = "New"

        # Points the the asyncio.Process object
        self.proc = None

        # Keep track of the data
        self.stdout = None
        self.stderr = None
        self.exit_code = None

    def get_id(self):
        return self.id

    def get_status(self):
        return self.status

    async def start(self):
        """ Launch the task """
        pass

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """        
        pass

    async def check_if_exited(self):
        """ Check if the process exited. If so, 
        save stdout, stderr, exit_code and update the status. """
        pass
