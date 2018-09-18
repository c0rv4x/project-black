""" Module that will accumulate all the tasks described """
import sys
import asyncio
from black.workers.masscan.masscan_worker import MasscanWorker


try:
	loop = asyncio.get_event_loop()
	masscan = MasscanWorker()
	loop.create_task(masscan.start())
	loop.run_forever()
except KeyboardInterrupt:
	loop.run_until_complete(masscan.stop())
	sys.exit(1)