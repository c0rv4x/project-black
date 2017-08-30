import json
import signal
import threading

import asyncio
from asyncio.subprocess import PIPE
from libnmap.parser import NmapParser, NmapParserException
from black.db import Project, Scan, get_new_session, destroy_session

from black.workers.common.async_task import AsyncTask
from uuid import uuid4
from black.workers.common.task import Task


class NmapTask(AsyncTask):
    """ Major class for working with nmap """
    def __init__(self, task_id, target, params, project_uuid):
        AsyncTask.__init__(self, task_id, 'nmap', target, params, project_uuid)
        self.proc = None

        self.exit_code = None
        self.stdout = []
        self.stderr = []

    async def start(self):
        """ Launch the task """
        self.command = ['nmap', '-oX', '-'] + self.params['program'] + self.target
        print("Start: ",' '.join(self.command))
        self.proc = await asyncio.create_subprocess_exec(*self.command, stdin=PIPE, stdout=PIPE, stderr=PIPE)

        await self.set_status("Working", 0, "")
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
            stdout_chunk = await self.proc.stdout.read(4096)
            stdout_chunk_decoded = stdout_chunk.decode('utf-8')

            if stdout_chunk_decoded:
                await self.append_stdout(stdout_chunk_decoded)

            # Create the task on reading the next chunk of data
            loop = asyncio.get_event_loop()
            loop.create_task(self.read_stdout())

        # If the task has finished, drain stdout
        elif self.status == 'Aborted' or self.status == 'Finished':
            try:
                # Try to read from stdout for quite some time
                stdout_chunk = await asyncio.wait_for(self.proc.stdout.read(), 0.5)
                stdout_chunk_decoded = stdout_chunk

                # Wierd thing: while reading from the stdout of finished process,
                # b'' is read in a while loop, so we need to check.
                if len(stdout_chunk) == 0:
                    raise Exception("No data left")
                else:
                    await self.append_stdout(stdout_chunk_decoded)
                    loop.create_task(self.read_stdout())
            except TimeoutError as _:
                pass
            except Exception as _:
                pass

    async def read_stderr(self):
        """ Similar to read_stdout """
        if self.status == 'New' or self.status == 'Working':
            stderr_chunk = await self.proc.stderr.read(4096)
            stderr_chunk_decoded = stderr_chunk.decode('utf-8')

            if stderr_chunk_decoded:
                await self.append_stderr(stderr_chunk_decoded)

            # Create the task on reading the next chunk of data
            loop = asyncio.get_event_loop()
            loop.create_task(self.read_stderr())

        # If the task has finished, drain stderr
        elif self.status == 'Aborted' or self.status == 'Finished':
            try:
                stderr_chunk = await asyncio.wait_for(self.proc.stderr.read(), 0.5)
                stderr_chunk_decoded = stderr_chunk
                if len(stderr_chunk) == 0:
                    raise Exception("No data left")
                else:
                    await self.append_stderr(stderr_chunk_decoded)
                    loop.create_task(self.read_stderr())
            except TimeoutError as _:
                pass
            except Exception as _:
                pass

    def spawn_status_poller(self):
        thread = threading.Thread(target=self.progress_poller)
        thread.start()

    def progress_poller(self):
        pass

    async def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
        exit_code = await self.proc.wait()
        self.exit_code = exit_code
        # The process has exited.

        if self.exit_code == 0:
            try:
                self.parse_results()
            except Exception as e:
                print("Set to aborted", "".join(self.stderr))
                print(str(e))
                await self.set_status("Aborted", progress=-1, text="".join(self.stderr))
            else:
                print("Finished: ",' '.join(self.command))
                await self.set_status("Finished", progress=100)
        else:
            print("Not null exit code", ' '.join(self.command))
            print("".join(self.stderr))
            await self.set_status("Aborted", progress=-1, text="".join(self.stderr))


    def parse_results(self):
        def save_scan(data):
            session = get_new_session()

            scans_ids = self.params["saver"].get('scans_ids', None)
            if scans_ids:
                target_scan = list(filter(lambda x: data["port_number"] == x["port_number"], scans_ids))[0]
                target_scan_id = target_scan["scan_id"]
                new_scan = session.query(Scan).filter_by(scan_id=target_scan_id).first()

                new_scan.banner = data["banner"]
                new_scan.protocol = data["protocol"]
            else:
                new_scan = Scan()
                session.add(new_scan)

            session.commit()
            destroy_session(session)

        stdout = "".join(self.stdout)

        try:
            nmap_report = NmapParser.parse(stdout)
        except NmapParserException:
            nmap_report = NmapParser.parse(stdout, incomplete=True)
        for scanned_host in nmap_report.hosts:
            for service_of_host in scanned_host.services:
                if service_of_host.open():
                    save_scan({
                        'target': str(scanned_host.address),
                        'port_number': int(service_of_host.port),
                        'protocol': str(service_of_host.service),
                        'banner': str(service_of_host.banner),
                        'project_uuid': self.project_uuid
                    })
                       
'''
        scans = session.query(Scan).filter_by(
                target=target["hostname"],
                port_number=target["port"],
                scan_id=scan_id).all()

            print(scans)
            if len(scans) > 1:
                # TODO: add logger
                print("HEY, error here: screenshotter/db_save.py. Multiple shits")
                print(scans)

            elif len(scans) == 0:
                # TODO: add logger
                print("Hey, error occured: race condition screenshotter/db_save.py")
            else:
                scan = scans[0]
                scan.screenshot_path = screenshot_path

                old_tasks_ids = scan.tasks_ids
                if old_tasks_ids is None:
                    new_tasks_ids = [task_id]
                else:
                    new_tasks_ids = json.loads(old_tasks_ids)
                    new_tasks_ids.append(task_id)

                scan.tasks_ids = json.dumps(new_tasks_ids)

                session.commit()

            destroy_session(session)
'''
