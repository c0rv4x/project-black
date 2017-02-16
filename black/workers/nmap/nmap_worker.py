import signal
import asyncio
import aioredis
from concurrent.futures._base import TimeoutError

from worker import Worker


class NmapTask(object):

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

    async def check_if_exited(self):
        """ Check if the process exited. If so, 
        save stdout, stderr, exit_code and update the status. """
        try:
            # Give 0.1s for a check that a process has exited
            (stdout, stderr) = await asyncio.wait_for(self.proc.communicate(), 0.1)
        except TimeoutError as e:
            # Not yet finished
            return False
        else:
            # The process have exited.
            # Save the data locally.]
            print("The process finished OK")
            self.stdout = stdout
            self.stderr = stderr
            self.exit_code = await self.proc.wait()

            if self.exit_code == 0:
                self.status = "Finished"
            else:
                self.status = "Aborted"

            return True


loop = asyncio.get_event_loop()
nmap = Worker('nmap', NmapTask)
loop.run_until_complete(nmap.initialize())
loop.run_until_complete(nmap.start_tasks_consumer())
loop.run_until_complete(nmap.start_notifications_consumer())
loop.run_until_complete(nmap.update_active_processes())
loop.run_forever()
