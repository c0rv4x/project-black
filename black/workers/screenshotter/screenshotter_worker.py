""" Module that will accumulate all the tasks described """
from black.workers.screenshotter import ScreenshotterTask
from black.workers.common.worker import Worker


class ScreenshotterWorker(Worker):
    """ Main class that monitors and manager instances of running screenshotter. """
    def __init__(self):
        Worker.__init__(self, 'screenshotter', ScreenshotterTask)

    async def start(self):
        """ Start all the necessary consumers """
        await self.initialize()
        await self.start_tasks_consumer()
        await self.start_notifications_consumer()
