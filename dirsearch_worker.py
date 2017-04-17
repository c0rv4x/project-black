""" Module that will accumulate all the tasks described """
# from black.workers.screenshotter.screenshotter_worker import ScreenshotterWorker

from black.workers.dirsearch.dirsearch_worker import DirsearchWorker


dirsearch = DirsearchWorker()
dirsearch.initialize()
dirsearch.start()
