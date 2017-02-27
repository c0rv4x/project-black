import pika
import asynqp
import asyncio

from uuid import uuid4

def sync_go():
    random_id = "nmap_task_"+str(uuid4())

    connection = pika.BlockingConnection(pika.ConnectionParameters(
                   'localhost'))
    channel = connection.channel()

    # Create 2 queues and an exchange on the broker
    channel.queue_declare(queue='nmap_tasks', durable=True)
    channel.queue_declare(queue='nmap_notifications', durable=True)

    print("-"*20)
    print("Sending task")

    task_id = str(uuid4())
    channel.basic_publish(body=str({
        'task_id': 'nmap_task_' + task_id,
        'target': 'ya.ru',
        'params': ['--top-ports', '10'],
        'project_name': 'test_project'
    }), exchange="", routing_key='nmap_tasks')
    print("Sent task")

    channel.close()
    connection.close()


async def async_go():
    random_id = "nmap_task_"+str(uuid4())

    connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

    # Open a communications channel
    channel = await connection.open_channel()

    # Create 2 queues and an exchange on the broker
    exchange = await channel.declare_exchange('tasks.exchange', 'direct')
    tasks_queue = await channel.declare_queue('nmap_tasks')
    notifications_queue = await channel.declare_queue('nmap_notifications')

    # Bind the queue to the exchange, so the queue will get messages
    # published to the exchange
    await tasks_queue.bind(exchange, routing_key='nmap_tasks')
    await notifications_queue.bind(exchange, routing_key='nmap_notifications')

    print("-"*20)
    print("Sending task")

    task_id = str(uuid4())
    msg = asynqp.Message({
        'task_id': 'nmap_task_' + task_id,
        'target': 'ya.ru',
        'params': ['--top-ports', '10'],
        'project_name': 'test_project'
    })
    exchange.publish(msg, 'nmap_tasks')
    print("Sent task")

    await channel.close()
    await connection.close()

def main():
    loop = asyncio.get_event_loop()
    loop.run_until_complete(async_go())


if __name__ == '__main__':
    main()
