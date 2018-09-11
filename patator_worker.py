""" Module that will accumulate all the tasks described """
import sys
import asyncio
from black.workers.patator.patator_worker import PatatorWorker


try:
	loop = asyncio.get_event_loop()
	patator = PatatorWorker()
	loop.create_task(patator.start())
	loop.run_forever()
except KeyboardInterrupt:
	loop.run_until_complete(patator.stop())
	sys.exit(1)