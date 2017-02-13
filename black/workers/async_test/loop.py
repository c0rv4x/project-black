import asyncio
from time import sleep

from asyncio.subprocess import PIPE


async def start_task():
    proc = await asyncio.create_subprocess_shell("sleep 3; curl -i ya.ru",
                                                      stdin=PIPE,
                                                      stdout=PIPE)
    print("pid: %s" % proc.pid)
    await process_task(proc)

async def process_task(proc):
    try:
        stdout, stderr = await asyncio.wait_for(proc.communicate(), 1)
    except Exception as e:
        print("Timeout")
        await process_task(proc)
    else:
        print("nmap read: %r" % stdout.decode('ascii'))

        exitcode = await proc.wait()
        print("(exit code %s)" % exitcode)

loop = asyncio.get_event_loop()
loop.run_until_complete(start_task())
