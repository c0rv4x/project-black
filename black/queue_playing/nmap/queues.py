from kombu import Exchange, Queue

task_exchange = Exchange('tasks', type='direct')
task_queue = Queue('nmap_task', task_exchange, routing_key='nmap_task')
notifications_queue = Queue('notification_task', task_exchange, routing_key='notification_task')
