""" Module with Patator task """
import os
import sys
import json
import shlex
import asyncio
import asyncio.streams
from concurrent.futures import ProcessPoolExecutor
from black.workers.patator.patator_ext import modules

from black.workers.common.async_task import AsyncTask


def start_program(arguments, socket_path=None):
    """ A tiny wrapper which is passed to multiprocessing.Process """
    print(arguments)
    args = shlex.split(arguments)
    name = args[1]
    print(args)
    available = dict(modules)
    ctrl, module = available[name]
    powder = ctrl(module, [name] + sys.argv[2:], socket_path)
    powder.fire()


class PatatorTask(AsyncTask):
    """ Class which is responsible for a single patator task """

    def __init__(self, task_id, target, params, project_uuid):
        AsyncTask.__init__(
            self, task_id, 'patator', target, params, project_uuid
        )

        self.patator_proc = None
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

        await asyncio.streams.start_unix_server(self.client_connected_cb, path=self.socket_path, loop=self.loop)

        try:
            self.patator_proc = self.loop.run_in_executor(
                ProcessPoolExecutor(), start_program, self.target,
                self.task_id, self.project_uuid, socket_path=self.socket_path
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
                decoded_data = json.loads(data.decode('utf-8').split("SPLITHERE")[-2])
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
            self.loop.create_task(self.poll_status(reader))

    async def wait_for_exit(self):
        """ Asyncronously waits for a process to exit """
        await self.patator_proc

        await self.all_done.acquire()
        if os.path.exists(self.socket_path):
            os.remove(self.socket_path)

    async def cancel(self):
        self.patator_proc.cancel()

        if os.path.exists(self.socket_path):
            os.remove(self.socket_path)

        await self.set_status("Aborted", progress=0)


def client_connected_cb(self, reader, writer):
    """ Callback which is called, after unix socket (the socket which is responsible
    for transporting socket data) receives a new connection """
    print("Someone connected to the socket")

import asyncio
if __name__ == '__main__':
    socket_name = '{}.sock'.format('123321')
    socket_path = os.path.join(os.getcwd(), socket_name)

    if os.path.exists(socket_path):
        os.remove(socket_path)

    asyncio.get_event_loop().run_until_complete(asyncio.streams.start_unix_server(client_connected_cb, path=socket_path, loop=asyncio.get_event_loop()))

    start_program(' '.join(sys.argv))