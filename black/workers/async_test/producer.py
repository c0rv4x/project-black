import asyncio
import aioredis

from uuid import uuid4


def main():
    loop = asyncio.get_event_loop()

    async def go():
        pub = await aioredis.create_redis(
            ('localhost', 6379))

        random_tag = "nmap_task_"+str(uuid4())
        res = await pub.publish_json('nmap_tasks', {"tag": random_tag, "command": "sleep 10; curl -i ya.ru"})

        await asyncio.sleep(3)
        print("Pausing task")
        res = await pub.publish_json('nmap_notifications', {"tag": random_tag, "command": "pause"})

        await asyncio.sleep(3)
        print("Unpausing task")
        # res = await pub.publish_json('nmap_notifications', {"tag": random_tag, "command": "unpause"})


        pub.close()

    loop.run_until_complete(go())


if __name__ == '__main__':
    main()