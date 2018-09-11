""" Module that will accumulate all the tasks described """
from patator.patator_task import PatatorTask
from common.async_worker import AsyncWorker


class PatatorWorker(AsyncWorker):
    """ Name says for itself """
    def __init__(self):
        AsyncWorker.__init__(self, 'patator', PatatorTask)

    async def start(self):
        """ Start all the necessary consumers """
        await self.initialize()
        await self.start_tasks_consumer()
        await self.start_notifications_consumer()
