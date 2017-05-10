import asyncio
import asynqp

from uuid import uuid4


def main():
    loop = asyncio.get_event_loop()

    async def go():
        random_id = "dnsscan_task_"+str(uuid4())

        connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

        # Open a communications channel
        channel = await connection.open_channel()

        # Create 2 queues and an exchange on the broker
        exchange = await channel.declare_exchange('tasks.exchange', 'direct')
        tasks_queue = await channel.declare_queue('dnsscan_tasks')
        notifications_queue = await channel.declare_queue('dnsscan_notifications')

        # Bind the queue to the exchange, so the queue will get messages
        # published to the exchange
        await tasks_queue.bind(exchange, routing_key='dnsscan_tasks')
        await notifications_queue.bind(exchange, routing_key='dnsscan_notifications')

        msg = asynqp.Message({
            'task_id': random_id,
            'target': 'anatoly.tech',
            'params': {
                'program': [{}]
            },
            'project_uuid': 'c03b8536-bfd1-40bf-ba00-28dd4ca18254'
        })
        exchange.publish(msg, 'dnsscan_tasks')
        print("Sent task")

        await channel.close()
        await connection.close()

    loop.run_until_complete(go())


if __name__ == '__main__':
    main()
