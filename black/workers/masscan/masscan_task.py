import signal
import asyncio
import aioredis
from asyncio.subprocess import PIPE
from concurrent.futures._base import TimeoutError

from black.workers.common.task import Task


class MasscanTask(Task):

    def __init__(self, process_id, command):
        Task.__init__(self, process_id, command)

    async def start(self):
        """ Launch the task """
        self.proc = await asyncio.create_subprocess_exec(*self.command)
        self.status = "Working"

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """        
        if command == 'pause':
            self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        elif command == 'stop':
            self.proc.terminate()  # SIGTERM
        elif command == 'unpause':
            self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    async def wait_for_exit(self):
        """ Check if the process exited. If so, 
        save stdout, stderr, exit_code and update the status. """
        print("Waiting for exit")
        (stdout, stderr) = await self.proc.communicate()
        # The process have exited.
        # Save the data locally.
        print("The process finished OK")
        self.stdout = stdout
        self.stderr = stderr
        self.exit_code = await self.proc.wait()

        if self.exit_code == 0:
            self.status = "Finished"
        else:
            self.status = "Aborted"
