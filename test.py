""" Module that will accumulate all the tasks described """
from black.workers.common.sync_worker import SyncWorker
# from black.workers.masscan.masscan_worker import MasscanWorker


# loop = asyncio.get_event_loop()
# masscan = MasscanWorker()
# loop.create_task(masscan.start())
# loop.run_forever()

class ClassName(object):
	"""docstring for ClassName"""
	def __init__(self, arg, sd):
		super(ClassName, self).__init__()
		self.arg = arg
		

w = SyncWorker('test', ClassName)
w.initialize()
w.produce_sample()
w.start_tasks_consumer()
