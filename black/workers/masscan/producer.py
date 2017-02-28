import asyncio
import asynqp

from uuid import uuid4


def main():
    loop = asyncio.get_event_loop()

    async def go():
        random_id = "masscan_task_"+str(uuid4())

        connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

        # Open a communications channel
        channel = await connection.open_channel()

        # Create 2 queues and an exchange on the broker
        exchange = await channel.declare_exchange('tasks.exchange', 'direct')
        tasks_queue = await channel.declare_queue('masscan_tasks')
        notifications_queue = await channel.declare_queue('masscan_notifications')

        # Bind the queue to the exchange, so the queue will get messages
        # published to the exchange
        await tasks_queue.bind(exchange, routing_key='masscan_tasks')
        await notifications_queue.bind(exchange, routing_key='masscan_notifications')

        print("-"*20)
        print("Sending task")


        msg = asynqp.Message({
            'task_id': 'masscan_task_' + random_id,
            'target': '213.180.193.0/28',
            'params': {
                'program': ['-p80-1000']
            },
            'project_name': 'test_project'
        })
        exchange.publish(msg, 'masscan_tasks')
        print("Sent task")

        await channel.close()
        await connection.close()

    loop.run_until_complete(go())


if __name__ == '__main__':
    main()
