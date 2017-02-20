""" Module that will accumulate all the tasks described """
import asyncio
from black.workers.masscan import MasscanTask
from black.workers.common.worker import Worker


class MasscanWorker(Worker):
	""" """
	def __init__(self):
		Worker.__init__(self, 'masscan', MasscanTask)

	async def start(self):
		await self.initialize()
		await self.start_tasks_consumer()
		await self.start_notifications_consumer()



# loop = asyncio.get_event_loop()
# loop.run_until_complete(masscan.initialize())
# loop.run_until_complete(masscan.start_tasks_consumer())
# loop.run_until_complete(masscan.start_notifications_consumer())
# loop.run_forever()
