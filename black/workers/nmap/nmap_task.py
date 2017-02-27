import signal
import threading

import asyncio
from asyncio.subprocess import PIPE
from libnmap.parser import NmapParser
from black.models import Scan

from black.workers.common.task import Task


class NmapTask(Task):
    """ Major class for working with nmap """
    def __init__(self, task_id, command):
        Task.__init__(self, task_id, command)
        self.proc = None
        self.status = "New"

        self.exit_code = None
        self.stdout = []
        self.stderr = []

    async def start(self):
        """ Launch the task """
        self.proc = await asyncio.create_subprocess_exec(*self.command, stdin=PIPE, stdout=PIPE, stderr=PIPE)

        self.set_status("Working")
        loop = asyncio.get_event_loop()
        loop.create_task(self.read_stdout())
        loop.create_task(self.read_stderr())
        self.spawn_status_poller()

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """
        if command == 'pause':
            self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        elif command == 'stop':
            self.proc.terminate()  # SIGTERM
        elif command == 'unpause':
            self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    async def read_stdout(self):
        """ Read from stdout by chunks, store it in self.stdout """
        # If we know, that there will be some data, we read it
        if self.status == 'New' or self.status == 'Working':
            stdout_chunk = await self.proc.stdout.read(1024)
            self.stdout.append(stdout_chunk)

            # Create the task on reading the leftover
            loop = asyncio.get_event_loop()
            loop.create_task(self.read_stdout())

        # If the task has finished, drain stdout
        elif self.status == 'Aborted' or self.status == 'Finished':
            try:
                stdout_chunk = await asyncio.wait_for(self.proc.stdout.read(), 0.5)
                if len(stdout_chunk) == 0:
                    raise Exception("No data left")
                else:
                    self.stdout.append(stdout_chunk)
            except TimeoutError as _:
                pass
            except Exception as _:
                pass
            else:
                loop = asyncio.get_event_loop()
                loop.create_task(self.read_stdout())

    async def read_stderr(self):
        """ Similar to read_stdout """
        if self.status == 'New' or self.status == 'Working':
            stderr_chunk = await self.proc.stderr.read(1024)
            self.stderr.append(stderr_chunk)

            loop = asyncio.get_event_loop()
            loop.create_task(self.read_stderr())
        elif self.status == 'Aborted' or self.status == 'Finished':
            try:
                stderr_chunk = await asyncio.wait_for(self.proc.stderr.read(), 0.5)
                if len(stderr_chunk) == 0:
                    raise Exception("No data left")
                else:
                    self.stderr.append(stderr_chunk)
            except TimeoutError as _:
                pass
            except Exception as _:
                pass
            else:
                print(3)
                loop = asyncio.get_event_loop()
                loop.create_task(self.read_stderr())

    def spawn_status_poller(self):
        thread = threading.Thread(target=self.progress_poller)
        thread.start()

    def progress_poller(self):
        pass

    async def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
        print("Waiting for exit")
        exit_code = await self.proc.wait()
        self.exit_code = exit_code
        # The process have exited.
        # Save the data locally.
        print("The process finished OK")
        print(self.stdout)
        parse_results("".join(self.stdout))

        if self.exit_code == 0:
            self.status = "Finished"
        else:
            # The process have exited.
            # Save the data locally.]
            print("The process finished OK")
            self.stdout = stdout
            self.stderr = stderr
            self.exit_code = await self.proc.wait()

            if self.exit_code == 0:
                self.set_status("Finished")
            else:
                self.set_status("Aborted")

    def parse_results(self, stdout):
        stdout = stdout.decode('ascii')
        print(stdout)
        try:
            nmap_report = NmapParser.parse(stdout)
        except NmapParserException:
            nmap_report = NmapParser.parse(stdout, incomplete=True)
        for scanned_host in nmap_report.hosts:
            for service_of_host in scanned_host.services:
                if service_of_host.open():
                    query = Scan(target=scanned_host, port_number=service_of_host.port, protocol=service_of_host.service)
                    query.save()
        all_entries = Scan.objects.all()
        print(all_entries)
        print(dict_of_ports)
