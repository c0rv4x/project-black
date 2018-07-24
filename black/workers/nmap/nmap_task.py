import json
import signal
import threading

import asyncio
from asyncio.subprocess import PIPE
from libnmap.parser import NmapParser, NmapParserException

from black.db import IPDatabase, ScanDatabase, Sessions
from black.workers.common.async_task import AsyncTask
from uuid import uuid4


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
        print(self.params)
        flags_raw = self.params['program'][0].split(' -')
        flags = [flags_raw[0]]

        if len(flags_raw) > 1:
            for each_flag in flags_raw[1:]:
                flags.append('-' + each_flag)

        if self.params.get('special', None):
            self.command = ['nmap', '-oX', '-'] + flags + self.params["special"] + [self.target]
        else:
            self.command = ['nmap', '-oX', '-'] + flags + [self.target]
        print("Start: ", ' '.join(self.command))
        self.proc = await asyncio.create_subprocess_exec(*self.command, stdin=PIPE, stdout=PIPE, stderr=PIPE)

        await self.set_status("Working", 0, "")
        loop = asyncio.get_event_loop()
        loop.create_task(self.read_stdout())
        loop.create_task(self.read_stderr())
        # self.spawn_status_poller()

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
                target = self.parse_results()
            except Exception as e:
                print("Set to aborted", "".join(self.stderr))
                print(str(e))
                await self.set_status("Aborted", progress=-1, text="".join(self.stderr))

                raise(e)
            else:
                print("Finished: ", target)
                await self.set_status("Finished", progress=100, text=target)
        else:
            print("Not null exit code", ' '.join(self.command))
            print("".join(self.stderr))
            await self.set_status("Aborted", progress=-1, text="".join(self.stderr))

    def parse_results(self):
        def save_scan(data):
            session = sessions.get_new_session()

            scans_ids = self.params["saver"].get('scans_ids', None)
            if scans_ids:
                target_scan = list(
                    filter(
                        lambda x: data["port_number"] == x["port_number"],
                        scans_ids
                    )
                )[0]
                target_scan_id = target_scan["scan_id"]
                new_scan = (
                    session.query(
                        ScanDatabase
                    ).filter(
                        ScanDatabase.scan_id==target_scan_id
                    ).first()
                )

                new_scan.banner = data["banner"]
                new_scan.protocol = data["protocol"]
            else:
                try:
                    ip = (
                        session.query(
                            IPDatabase.id
                        ).filter(
                            IPDatabase.target == data["target"],
                            IPDatabase.project_uuid == data["project_uuid"]
                        ).one()
                    )

                    new_scan = ScanDatabase(
                        scan_id=str(uuid4()),
                        target=ip,
                        port_number=data["port_number"],
                        protocol=data["protocol"],
                        banner=data["banner"],
                        project_uuid=data["project_uuid"]
                    )
                except Exception as e:
                    print("Nmap " + e)
                    raise e
            session.add(new_scan)
            session.commit()
            sessions.destroy_session(session)

        stdout = "".join(self.stdout)

        try:
            nmap_report = NmapParser.parse(stdout)
        except NmapParserException:
            nmap_report = NmapParser.parse(stdout, incomplete=True)

        sessions = Sessions()
        targets = [self.target]
        
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

        return targets
