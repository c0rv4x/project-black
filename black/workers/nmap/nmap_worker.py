""" Module that will accumulate all the tasks described """
from black.workers.nmap import NmapTask
from black.workers.common.worker import Worker


class NmapWorker(Worker):
    """ Name says for itself """
    def __init__(self):
        Worker.__init__(self, 'nmap', NmapTask)

    async def start(self):
        """ Start all the necessary consumers """
        await self.initialize()
        await self.start_tasks_consumer()
        await self.start_notifications_consumer()
