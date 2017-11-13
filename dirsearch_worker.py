""" Module that will accumulate all the tasks described """
# from black.workers.screenshotter.screenshotter_worker import ScreenshotterWorker

import asyncio
from black.workers.dirsearch.dirsearch_worker import DirsearchWorker


loop = asyncio.get_event_loop()
dirsearch = DirsearchWorker()
loop.create_task(dirsearch.start())
loop.run_forever()