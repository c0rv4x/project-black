import json
import string
import random
import asyncio
import aio_pika


def rand_string():
    return ''.join([random.choice(string.ascii_lowercase) for i in range(10)])

async def send(loop):

    connection = await aio_pika.connect_robust(
        "amqp://{}:{}@{}:{}/".format(
            'guest',
            'guest',
            '127.0.0.1',
            5672
        ), loop=loop
    )

    # Open a communications channel
    channel = await connection.channel()

    # Create an exchange on the broker
    exchange = await channel.declare_exchange(
        'tasks.exchange',
        durable=True
    )

    queue = await channel.declare_queue(
        'amass' + '_tasks',
        durable=True
    )
    await queue.bind(exchange, 'amass' + '_tasks')


    import sys
    await exchange.publish(
        routing_key="amass" + "_tasks",
        message=aio_pika.Message(
            body=json.dumps({
                'task_id': rand_string(),
                'target': sys.argv[1],
                'params': {'program': {"argv": ""}},
                'project_uuid': 3
            }).encode()
        )
    )

    await connection.close()

loop = asyncio.new_event_loop()
loop.run_until_complete(send(loop))
loop.close()