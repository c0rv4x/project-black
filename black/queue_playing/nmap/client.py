from kombu.pools import producers

from queues import task_exchange



def send_as_task(connection, value, routing_key='nmap_task'):
    payload = {'i': value}

    with producers[connection].acquire(block=True) as producer:
        producer.publish(payload,
                         serializer='pickle',
                         compression='bzip2',
                         exchange=task_exchange,
                         declare=[task_exchange],
                         routing_key=routing_key)


def send_as_notification(connection, value, routing_key='notification_task'):
    payload = {'i': value}

    with producers[connection].acquire(block=True) as producer:
        producer.publish(payload,
                         serializer='pickle',
                         compression='bzip2',
                         exchange=task_exchange,
                         declare=[task_exchange],
                         routing_key=routing_key)

if __name__ == '__main__':
    from kombu import Connection
    from tasks import hello_task

    connection = Connection('amqp://guest:guest@localhost:5672//')
    for i in xrange(0,10):
        send_as_task(connection, i)
    for i in xrange(0,2):
        send_as_task(connection, i, routing_key='notification_task')