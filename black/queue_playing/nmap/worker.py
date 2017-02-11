from queues import task_queue, notifications_queue
from time import sleep

from kombu import Connection


def process_task(body, message):
    print "[T] " + str(body)
    message.ack()

def process_notification(body, message):
    print "[N] " + str(body)
    message.ack()

# connections
with Connection('amqp://guest:guest@localhost//') as conn:
    while True:
        with conn.Consumer(task_queue, accept=['pickle','json'], callbacks=[process_task]) as tasks_consumer:
            try:
                conn.drain_events(timeout=1)
            except Exception as e:
                pass

        with conn.Consumer(notifications_queue, accept=['pickle','json'], callbacks=[process_notification]) as notifications_consumer:
            try:
                conn.drain_events(timeout=1)
            except Exception as e:
                pass