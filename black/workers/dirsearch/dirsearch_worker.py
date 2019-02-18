""" Module that will accumulate all the tasks described """
from black.workers.dirsearch import DirsearchTask
from black.workers.common.async_worker import AsyncWorker


class DirsearchWorker(AsyncWorker):
    """ Main class that monitors and manager instances of running dirsearch. """
    def __init__(self):
        AsyncWorker.__init__(self, 'dirsearch', DirsearchTask)

    async def start(self):
        """ Start all the necessary consumers """
        await self.initialize()
        await self.start_tasks_consumer()
        await self.start_notifications_consumer()
