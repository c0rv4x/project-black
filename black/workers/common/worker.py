from kombu import Connection


class Worker(object):
    def __init__(self, task_queue, notifications_queue, process_task,  process_notification):
        self.task_queue = task_queue
        self.notifications_queue = notifications_queue

        self.process_task = process_task
        self.process_notification = process_notification

    def start(self):
        with Connection('amqp://guest:guest@localhost//') as conn:
            while True:
                with conn.Consumer(self.task_queue, accept=['pickle','json'], callbacks=[self.process_task]) as tasks_consumer:
                    try:
                        conn.drain_events(timeout=1)
                    except Exception as e:
                        pass

                with conn.Consumer(self.notifications_queue, accept=['pickle','json'], callbacks=[self.process_notification]) as notifications_consumer:
                    try:
                        conn.drain_events(timeout=1)
                    except Exception as e:
                        pass
