""" Module that will accumulate all the tasks described """
import sys
import asyncio
from black.workers.dirsearch.dirsearch_worker import DirsearchWorker


try:
	loop = asyncio.get_event_loop()
	dirsearch = DirsearchWorker()
	loop.create_task(dirsearch.start())
	loop.run_forever()
except KeyboardInterrupt:
	loop.run_until_complete(dirsearch.stop())
	sys.exit(1)