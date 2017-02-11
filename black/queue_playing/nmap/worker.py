from queues import task_queue, notifications_queue
from time import sleep

from kombu import Connection


def process_media(body, message):
    print body
    message.ack()

# connections
with Connection('amqp://guest:guest@localhost//') as conn:
    while True:
        with conn.Consumer(task_queue, accept=['pickle','json'], callbacks=[process_media]) as consumer:
            try:
                print "Getting data from queue"
                sleep(0.5)
                conn.drain_events(timeout=1)
            except Exception as e:
                pass

        with conn.Consumer(notifications_queue, accept=['pickle','json'], callbacks=[process_media]) as consumer:
            try:
                print "Getting notificatoins from queue"
                sleep(0.5)
                conn.drain_events(timeout=1)
            except Exception as e:
                pass