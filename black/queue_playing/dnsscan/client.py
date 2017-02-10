from kombu.pools import producers

from queues import task_exchange


def send_as_task(connection, input_number=0):
    payload = {'input_number': input_number}

    with producers[connection].acquire(block=True) as producer:
        producer.publish(payload,
                         serializer='pickle',
                         compression='bzip2',
                         exchange=task_exchange,
                         declare=[task_exchange],
                         routing_key='dnsscan_task')

if __name__ == '__main__':
    from kombu import Connection
    from tasks import hello_task

    connection = Connection('amqp://guest:guest@localhost:5672//')
    for i in xrange(0,50):
        send_as_task(connection, i)