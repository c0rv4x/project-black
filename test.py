""" Module that will accumulate all the tasks described """
import asyncio
from black.workers.masscan.masscan_worker import MasscanWorker


loop = asyncio.get_event_loop()
masscan = MasscanWorker()
loop.create_task(masscan.start())
loop.run_forever()
