""" DirsearchTask, that's it """
import os
import json
import asyncio
import asyncio.streams
from concurrent.futures import ProcessPoolExecutor

from black.workers.common.async_task import AsyncTask
from .dirsearch_ext.dirsearch import Program


def start_program(*args):
    """ A tiny wrapper which is passed to multiprocessing.Process. We cant pass
    a Program, as some locks cannot be serialized """
    Program(*args)


class DirsearchTask(AsyncTask):
    """ Class which is responsible for a single dirsearch task """

    def __init__(self, task_id, target, params, project_uuid):
        AsyncTask.__init__(
            self, task_id, 'dirsearch', target, params, project_uuid
        )

        program_params = params['program']
        self.params_object = program_params

        self.dirsearch_proc = None
        self.socket_path = None

        self.loop = asyncio.get_event_loop()

        self.all_done = asyncio.Lock()

    async def start(self):
        await self.all_done.acquire()

        await self.set_status('Working', progress=0)

        socket_name = '{}.sock'.format(self.task_id)
        self.socket_path = os.path.join(os.getcwd(), socket_name)

        if os.path.exists(self.socket_path):
            os.remove(self.socket_path)

        server = await asyncio.streams.start_unix_server(self.client_connected_cb, path=self.socket_path, loop=self.loop)

        try:
            self.dirsearch_proc = self.loop.run_in_executor(
                ProcessPoolExecutor(), start_program, self.target,
                self.task_id, self.project_uuid, self.socket_path,
                self.params_object
            )
        except Exception as exc:
            print("Exception starting ProcessPoolExecutor", exc)

    def client_connected_cb(self, reader, writer):
        """ Callback which is called, after unix socket (the socket which is responsible
        for transporting socket data) receives a new connection """
        self.loop.create_task(self.poll_status(reader))

    async def poll_status(self, reader):
        """ Getting a reader, tries to asynchronously read some data
        from that socket and parse it """
        try:
            data = await reader.read(1000)

            if data:
                    decoded_data = json.loads(data.decode('utf-8'))
                    status = decoded_data['status']
                    progress = decoded_data['progress']

                    if status == 'Finished' or status == 'Aborted':
                        await self.set_status(status, progress=progress, text=self.target)

                        self.all_done.release()
                        return
                    else:
                        await self.set_status(status, progress=progress)

            self.loop.create_task(self.poll_status(reader))
        except Exception as exc:
            print("DirsearchTask:poll_status", exc, data)
            

    async def wait_for_exit(self):
        """ Asyncronously waits for a process to exit """
        await self.dirsearch_proc

        await self.all_done.acquire()
        if os.path.exists(self.socket_path):
            os.remove(self.socket_path)

    async def cancel(self):
        self.dirsearch_proc.cancel()

        if os.path.exists(self.socket_path):
            os.remove(self.socket_path)

        await self.set_status("Aborted", progress=0)
