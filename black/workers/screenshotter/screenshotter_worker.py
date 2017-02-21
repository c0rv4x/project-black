""" Module that will accumulate all the tasks described """
from black.workers.screenshotter.screenshotter_task import ScreenshotterTask
from black.workers.common.sync_worker import SyncWorker


class ScreenshotterWorker(SyncWorker):
    """ Main class that monitors and manager instances of running screenshotter. """
    def __init__(self):
        SyncWorker.__init__(self, 'screenshotter', ScreenshotterTask)
        self.initialize()

    def start(self):
        """ Start all the necessary consumers """
        self.start_tasks_consumer()
