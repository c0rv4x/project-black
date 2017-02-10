from kombu.pools import producers

from queues import task_exchange

priority_to_routing_key = {'high': 'hipri',
                           'mid': 'midpri',
                           'low': 'lopri'}


def send_as_task(connection, fun, args=(), kwargs={}, priority=5):
    payload = {'fun': fun, 'args': args, 'kwargs': kwargs, 'priority': priority}

    with producers[connection].acquire(block=True) as producer:
        producer.publish(payload,
                         serializer='pickle',
                         compression='bzip2',
                         exchange=task_exchange,
                         declare=[task_exchange],
                         priority=priority,
                         routing_key='midpri')

if __name__ == '__main__':
    from kombu import Connection
    from tasks import hello_task

    connection = Connection('redis+socket:///tmp/redis.sock')
    for i in xrange(0,10):
        send_as_task(connection, fun=hello_task, args=(i, ), kwargs={},
                     priority=1)
    for i in xrange(0,2):
        send_as_task(connection, fun=hello_task, args=(100*i, ), kwargs={},
                     priority=10)