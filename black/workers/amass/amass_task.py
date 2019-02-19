""" Keeps class with the interfaces that are pulled by worker
to manager the launched instance of scan. """
import re
import json
import signal

import asyncio
from asyncio.subprocess import PIPE

from black.workers.common.async_task import AsyncTask
from black.workers.amass.db_save import Saver


class AmassTask(AsyncTask):
    """ Major class for working with amass """

    def __init__(self, task_id, target, params, project_uuid):
        AsyncTask.__init__(self, task_id, 'amass', target, params, project_uuid)
        self.proc = None

        self.exit_code = None
        self.stdout = []
        self.stderr = []


    async def start(self):
        """ Launch the task and readers of stdout, stderr """
        try:
            self.command = ['amass', '-d'] + [self.target] + [self.params['program']['argv']]
            print(' '.join(self.command))
            self.proc = await asyncio.create_subprocess_shell(' '.join(self.command), stdout=PIPE, stderr=PIPE)

            # 1337 is hardcoded to show frontend that we don't track progress here
            await self.set_status("Working", progress=1337)
    
            # Launch readers
            loop = asyncio.get_event_loop()
            loop.create_task(self.read_stdout())
            loop.create_task(self.read_stderr())

        except Exception as exc:
            print(str(exc))
            await self.set_status("Aborted", 0, str(exc))

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
            except TimeoutError as _:
                pass
            except Exception as _:
                pass

    async def read_stderr(self):
        """ Similar to read_stdout """
        if self.status == 'New' or self.status == 'Working':
            stderr_chunk = await self.proc.stderr.read(1024)
            stderr_chunk_decoded = stderr_chunk.decode('utf-8')

            # Strip is a hack which allows not stroing long whitespace
            # strings. This sometimes occurs on long tasks and spoils stderr in the db.
            if stderr_chunk_decoded and stderr_chunk_decoded.strip():
                await self.append_stderr(stderr_chunk_decoded.strip())

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
            except TimeoutError as _:
                pass
            except Exception as _:
                pass

    async def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """
        exit_code = await self.proc.wait()
        self.exit_code = exit_code
        # The process has exited.

        if self.exit_code == 0:
            try:
                updated_hosts, updated_ips  = await self.save()
            except Exception as exc:
                print("Save exception", exc)
                await self.set_status("Aborted", progress=-1, text="".join(self.stderr))
            else:
                await self.set_status("Finished", progress=100, text=json.dumps({
                    "updated_hosts": updated_hosts,
                    "updated_ips": updated_ips
                }))
        else:
            await self.set_status("Aborted", progress=-1, text="".join(self.stderr))

        print('Finished', ' '.join(self.command))
 
    async def save(self):
        """ Parse output of the task and save it to the db"""
        saver = Saver(self.task_id, self.project_uuid)
        return await saver.save_raw_output(self.stdout)

    async def cancel(self):
        self.send_notification("stop")
        await self.set_status("Aborted", progress=0)

    async def handle_command(self, command):
        if command == 'cancel':
            await self.cancel()
