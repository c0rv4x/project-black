""" Module that will accumulate all the tasks described """
import asyncio
from black.workers.nmap import NmapTask
from black.workers.common.worker import Worker


loop = asyncio.get_event_loop()
nmap = Worker('nmap', NmapTask)
loop.run_until_complete(nmap.initialize())
loop.run_until_complete(nmap.start_tasks_consumer())
loop.run_until_complete(nmap.start_notifications_consumer())
loop.run_until_complete(nmap.update_active_processes())
loop.run_forever()
