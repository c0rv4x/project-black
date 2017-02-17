import asyncio
import asynqp

from uuid import uuid4


def main():
    loop = asyncio.get_event_loop()

    async def go():

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
            'command': ['nmap', '--top-ports', '10', 'ya.ru', '-oX', '-']
        })
        exchange.publish(msg, 'nmap_tasks')
        print("Sent task")
        print("-"*20)
        print("Now i am sleeping")

        await channel.close()
        await connection.close()
    loop.run_until_complete(go())


if __name__ == '__main__':
    main()
