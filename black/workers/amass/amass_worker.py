""" Module that will accumulate all the tasks described """
from black.workers.amass import AmassTask
from black.workers.common.async_worker import AsyncWorker


class AmassWorker(AsyncWorker):
    """ Main class that monitors and manager instances of running amass. """
    def __init__(self):
        AsyncWorker.__init__(self, 'amass', AmassTask)

    async def start(self):
        """ Start all the necessary consumers """
        await self.initialize()
        await self.start_tasks_consumer()
        await self.start_notifications_consumer()
