""" Module that will accumulate all the tasks described """
import sys
import asyncio
from black.workers.nmap.nmap_worker import NmapWorker


try:
	loop = asyncio.get_event_loop()
	nmap = NmapWorker()
	loop.create_task(nmap.start())
	loop.run_forever()
except KeyboardInterrupt:
	loop.run_until_complete(nmap.stop())
	sys.exit(1)