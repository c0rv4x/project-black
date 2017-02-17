""" Module that will accumulate all the tasks described """
import asyncio
from black.workers.masscan import MasscanTask
from black.workers.common.worker import Worker


loop = asyncio.get_event_loop()
masscan = Worker('masscan', MasscanTask)
loop.run_until_complete(masscan.initialize())
loop.run_until_complete(masscan.start_tasks_consumer())
loop.run_until_complete(masscan.start_notifications_consumer())
loop.run_forever()
