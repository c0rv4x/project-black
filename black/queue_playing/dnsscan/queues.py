from kombu import Exchange, Queue

task_exchange = Exchange('tasks', type='direct')
task_queues = [Queue('dnsscan_task', task_exchange, routing_key='dnsscan_task')]