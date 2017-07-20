""" Module that will accumulate all the tasks described """
import asyncio
from black.workers.nmap.nmap_worker import NmapWorker


loop = asyncio.get_event_loop()
nmap = NmapWorker()
loop.create_task(nmap.start())
loop.run_forever()
