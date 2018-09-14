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


def start_program(arguments, socket_path):
    """ A tiny wrapper which is passed to multiprocessing.Process """
    args = shlex.split(arguments)
    name = args[0]
    available = dict(modules)
    ctrl, module = available[name]
    powder = ctrl(module, [name] + args[1:], socket_path)
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
        host, port = self.target.split(':')
        args = self.params['program'][0] + " host={} port={}".format(host, port)
        # print(args)
        # return

        await self.set_status('Working', progress=0)

        socket_name = '{}.sock'.format(self.task_id)
        self.socket_path = os.path.join(os.getcwd(), socket_name)

        if os.path.exists(self.socket_path):
            os.remove(self.socket_path)

        await asyncio.streams.start_unix_server(self.client_connected_cb, path=self.socket_path, loop=self.loop)

        try:
            self.patator_proc = self.loop.run_in_executor(
                ProcessPoolExecutor(), start_program, args, self.socket_path
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
                # print(data)
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
            print("Patator:poll_status", exc, data)
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
