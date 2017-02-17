import signal
import asyncio
import aioredis
from asyncio.subprocess import PIPE
from concurrent.futures._base import TimeoutError
from libnmap.parser import NmapParser
from black.models import Scan

from black.workers.common.task import Task


class NmapTask(Task):

    def __init__(self, process_id, command):
        Task.__init__(self, process_id, command)

    async def start(self):
        """ Launch the task """
        print('starting')
        self.proc = await asyncio.create_subprocess_exec(*self.command, stdin=PIPE, stdout=PIPE, stderr=PIPE)
        self.status = "Working"

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """        
        if command == 'pause':
            self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        elif command == 'stop':
            self.proc.terminate()  # SIGTERM
        elif command == 'unpause':
            self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT
        elif command == 'get_progress':
            print(self.get_progress())

    def get_progress(self):
        status = self.get_status()
        if status == 'New':
            return 0
        elif status == 'Finished':
            return 100
        elif status == 'Aborted':
            return -1
        elif status == 'Working':
            return self.stdout.read()

    async def wait_for_exit(self):
        """ Check if the process exited. If so, 
        save stdout, stderr, exit_code and update the status. """
        print("Waiting for exit")
        (stdout, stderr) = await self.proc.communicate()
        # The process have exited.
        # Save the data locally.
        print("The process finished OK")
        self.stdout = stdout
        self.parse_results(stdout)
        self.stderr = stderr
        self.exit_code = await self.proc.wait()

        if self.exit_code == 0:
            self.status = "Finished"
        else:
            self.status = "Aborted"

    def parse_results(self, stdout):
        stdout = stdout.decode('ascii')
        print(stdout)
        try:
            nmap_report = NmapParser.parse(stdout)
        except NmapParserException:
            nmap_report = NmapParser.parse(stdout, incomplete = True)
        for scanned_host in nmap_report.hosts:
            for service_of_host in scanned_host.services:
                if service_of_host.open():
                    query = Scan(target=scanned_host, port_number=service_of_host.port, protocol=service_of_host.service)
                    query.save()
        all_entries = Scan.objects.all()
        print(all_entries)
        print(dict_of_ports)


