from queues import task_queue, notifications_queue
from time import sleep
from subprocess import Popen, PIPE
import threading

from kombu import Connection


working_processes = []

def long_function():
    for i in xrange(0,10):
        sleep(0.5)
        print "     Work: {}".format(i)

def process_task(body, message):
    print "[T] " + str(body)
    p = Popen(['./test.sh'], shell=True, stdout=PIPE, stderr=PIPE)
    working_processes.append(p)

    message.ack()

def process_notification(body, message):
    print "[N] " + str(body)
    message.ack()

def track_processes():
    global working_processes

    for i in xrange(0, len(working_processes)):
        pc = working_processes[i]

        if pc.poll() is not None:
            print "Finished:"
            (stdout, stderr) = pc.communicate()
            print stdout
            print stderr

    return True

def start():
    with Connection('redis://localhost:6379/') as conn:
        while True:
            ready_for_task = track_processes()

            if ready_for_task:
                with conn.Consumer(task_queue, accept=['pickle','json'], callbacks=[process_task]) as tasks_consumer:
                    print "-"*20
                    try:
                        conn.drain_events(timeout=2)
                    except Exception as e:
                        print "[T_E] " + str(e)
                        pass

            print "-"*20
            with conn.Consumer(notifications_queue, accept=['pickle','json'], callbacks=[process_notification]) as notifications_consumer:
                try:
                    conn.drain_events(timeout=2)
                except Exception as e:
                    print "[N_E] " + str(e)
                    pass

start()