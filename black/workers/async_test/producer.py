import asyncio
import aioredis

from uuid import uuid4


def main():
    loop = asyncio.get_event_loop()

    async def go():
        pub = await aioredis.create_redis(
            ('localhost', 6379))

        random_tag = "nmap_task_"+str(uuid4())
        res = await pub.publish_json('nmap_tasks', {"tag": random_tag, "command": "sleep 3; curl -i ya.ru"})

        pub.close()

    loop.run_until_complete(go())


if __name__ == '__main__':
    main()