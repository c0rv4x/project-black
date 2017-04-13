from uuid import uuid4
import asynqp
import asyncio



def main():
    loop = asyncio.get_event_loop()

    async def go():
        random_id = "dirsearch_task_"+str(uuid4())

        connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

        # Open a communications channel
        channel = await connection.open_channel()

        # Create 2 queues and an exchange on the broker
        exchange = await channel.declare_exchange('tasks.exchange', 'direct')
        tasks_queue = await channel.declare_queue('dirsearch_tasks')
        notifications_queue = await channel.declare_queue('dirsearch_notifications')

        # Bind the queue to the exchange, so the queue will get messages
        # published to the exchange
        await tasks_queue.bind(exchange, routing_key='dirsearch_tasks')
        await notifications_queue.bind(exchange, routing_key='dirsearch_notifications')

        msg = asynqp.Message({
            'task_id': random_id,
            'target': 'https://yandex.ru/',
            'params': {
                'program': [{}]
            },
            'project_uuid': 'e67c91f1-26bc-41a3-b4a2-995e8214fa3f'
        })
        exchange.publish(msg, 'dirsearch_tasks')
        print("Sent task")

        await channel.close()
        await connection.close()

    loop.run_until_complete(go())


if __name__ == '__main__':
    main()
