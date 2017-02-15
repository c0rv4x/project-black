import signal
import asyncio
import platform
import aioredis
from concurrent.futures._base import TimeoutError

from worker import Worker


class NmapTask(object):

    def __init__(self, process_id, command):
        self.platform = platform.system()
        self.id = process_id
        self.command = command
        self.status = "New"
        self.proc = None

        self.stdout = None
        self.stderr = None
        self.exit_code = None

    def get_id(self):
        return self.id

    async def start(self):
        self.proc = await asyncio.create_subprocess_exec(*self.command)
        self.status = "Working"

    async def process_notification(self, command):
        if command == 'pause':
            print("[Notif] Pause")

            self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        elif command == 'stop':
            print("[Notif] Stop")
            self.proc.terminate()  # SIGTERM
        elif command == 'unpause':
            print("[Notif] Unpause")
            self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    async def check_if_exited(self):
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
loop.run_until_complete(nmap.process_queues())
