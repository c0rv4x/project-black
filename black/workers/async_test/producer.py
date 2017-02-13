import asyncio
import aioredis


def main():
    loop = asyncio.get_event_loop()

    async def go():
        pub = await aioredis.create_redis(
            ('localhost', 6379))

        res = await pub.publish_json('nmap_tasks', ["Hello", "world"])

        pub.close()

    loop.run_until_complete(go())


if __name__ == '__main__':
    main()