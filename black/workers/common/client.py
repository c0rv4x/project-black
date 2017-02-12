from kombu.pools import producers

from queues import task_exchange, task_queue, notifications_queue


def send_as_task(connection, value):
    payload = {'i': value}

    with producers[connection].acquire(block=True) as producer:
        producer.publish(payload,
                         serializer='pickle',
                         compression='bzip2',
                         exchange=task_exchange,
                         declare=[task_queue],
                         routing_key='generic_task')


def send_as_notification(connection, value):
    payload = {'i': value}

    with producers[connection].acquire(block=True) as producer:
        producer.publish(payload,
                         serializer='pickle',
                         compression='bzip2',
                         exchange=task_exchange,
                         declare=[notifications_queue],
                         routing_key='notification_task')

if __name__ == '__main__':
    from kombu import Connection

    connection = Connection('redis://localhost:6379/')
    for i in xrange(0,3):
        send_as_task(connection, i)
    for i in xrange(0,3):
        send_as_notification(connection, i)