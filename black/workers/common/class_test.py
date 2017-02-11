from queues import task_queue, notifications_queue
from worker import Worker

def process_task(body, message):
	print "[+] " + str(body)
	message.ack()

def process_notification(body, message):
	print "[*] " + str(body)
	message.ack()

wo = Worker(task_queue, notifications_queue, process_task, process_notification)
wo.start()