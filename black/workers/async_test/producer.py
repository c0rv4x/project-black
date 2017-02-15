import asyncio
import aioredis

from uuid import uuid4


def main():
    loop = asyncio.get_event_loop()

    async def go():
        pub = await aioredis.create_redis(
            ('localhost', 6379))

        random_id = "nmap_task_"+str(uuid4())
        res = await pub.publish_json('nmap_tasks', {"task_id": random_id, "command": "nmap -p - ya.ru --stats-every 0.5"})

        await asyncio.sleep(3)
        print("Pausing task")
        res = await pub.publish_json('nmap_notifications', {"task_id": random_id, "command": "pause"})

        await asyncio.sleep(15)
        print("Unpausing task")
        res = await pub.publish_json('nmap_notifications', {"task_id": random_id, "command": "unpause"})


        pub.close()

    loop.run_until_complete(go())


if __name__ == '__main__':
    main()