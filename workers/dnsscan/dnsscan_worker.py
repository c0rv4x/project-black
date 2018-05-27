""" Module that will accumulate all the tasks described """
from black.workers.dnsscan import DNSScanTask
from black.workers.common.async_worker import AsyncWorker


class DNSScanWorker(AsyncWorker):
    """ Main class that monitors and manager instances of running dnsscan. """
    def __init__(self):
        AsyncWorker.__init__(self, 'dnsscan', DNSScanTask)

    async def start(self):
        """ Start all the necessary consumers """
        await self.initialize()
        await self.start_tasks_consumer()
        await self.start_notifications_consumer()
