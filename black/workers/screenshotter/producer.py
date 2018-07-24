import asyncio
from uuid import uuid4

import asynqp
import sys

def main():
    loop = asyncio.get_event_loop()

    async def send_screenshotter_start():
        random_id = "screenshotter_task_"+str(uuid4())

        connection = await asynqp.connect('localhost', 5672, username='guest', password='guest')

        # Open a communications channel
        channel = await connection.open_channel()

        # Create 2 queues and an exchange on the broker
        exchange = await channel.declare_exchange('tasks.exchange', 'direct')
        tasks_queue = await channel.declare_queue('screenshotter_tasks')
        notifications_queue = await channel.declare_queue('screenshotter_notifications')

        # Bind the queue to the exchange, so the queue will get messages
        # published to the exchange
        await tasks_queue.bind(exchange, routing_key='screenshotter_tasks')
        await notifications_queue.bind(exchange, routing_key='screenshotter_notifications')

        if sys.argv[1] == 'task':
            print("-"*20)
            print("Sending task")

            msg = asynqp.Message({
                'task_id': random_id,
                'target': {
                    'protocol': 'https:',
                    'hostname': 'ya.ru',
                    'port': 443,
                    'path': '/'
                },
                'params': {
                    'saver': {'scan_id': '123'}
                },
                'project_name': 'test_project'
            })
            exchange.publish(msg, 'screenshotter_tasks')
            print("Sent task")

        elif sys.argv[1] == 'note':
            print("-"*20)
            print("Sending notification")

            msg = asynqp.Message({
                'task_id': random_id,
                'command': 'pause'
            })
            exchange.publish(msg, 'screenshotter_notifications')
            print("Sent notification")
        else:
            print("-"*20)
            print("Sending task")

            msg = asynqp.Message({
                'task_id': random_id,
                'target': {
                    'protocol': 'https:',
                    'hostname': 'ya.ru',
                    'port': 443,
                    'path': '/'
                },
                'params': {'scan_id': '123'},
                'project_name': 'test_project'
            })
            exchange.publish(msg, 'screenshotter_tasks')

            print("Sent task")            

            from time import sleep
            sleep(2)

            print("-"*20)
            print("Sending notification")

            msg = asynqp.Message({
                'task_id': random_id,
                'command': 'pause'
            })
            exchange.publish(msg, 'screenshotter_notifications')
            print("Sent notification")

        await channel.close()
        await connection.close()

    loop.run_until_complete(send_screenshotter_start())


if __name__ == '__main__':
    main()
