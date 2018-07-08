""" Module that will accumulate all the tasks described """
import asyncio
from black.workers.dnsscan.dnsscan_worker import DNSScanWorker


loop = asyncio.get_event_loop()
dnsscan = DNSScanWorker()
loop.create_task(dnsscan.start())
loop.run_forever()
