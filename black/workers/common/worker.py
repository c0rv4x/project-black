from queues import task_queue, notifications_queue
from time import sleep
import threading

from kombu import Connection


working_threads = []

def long_function():
    for i in xrange(0,10):
        sleep(0.5)
        print "     Work: {}".format(i)

def process_task(body, message):
    print "[T] " + str(body)
    t = threading.Thread(target=long_function)
    working_threads.append(t)
    t.start()

    message.ack()

def process_notification(body, message):
    print "[N] " + str(body)
    message.ack()

def start():
    global working_threads

    with Connection('amqp://guest:guest@localhost//') as conn:
        while True:
            working_threads = filter(lambda x: x.is_alive(), working_threads)
            if len(working_threads) < 3:
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

start()