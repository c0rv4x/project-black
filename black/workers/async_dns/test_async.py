import asyncio
import aiodns
import time
# from pycares.errno import errorcode

domain_to_brute = 'iamiad.com'




async def resolve(domain, record_type):
    records = list()
    resolver = aiodns.DNSResolver()
    name = await resolver.query(domain, record_type)
    for n in name:
        records.append(n.host)
    return records


def error_checker_callback(future):
    if future.exception():
        exc = future.exception()
        errno = exc.args[0]

        if errno != 4:
            print("#{}, {}".format(errno, exc.args[1]))
    else:
        result = list(map(lambda x: (future.data, x.host), future._result))
        print(result)

# print(errorcode)

#async def dns_resolver():


def start_dnscan(domain):
    resolver = aiodns.DNSResolver()
    loop = asyncio.get_event_loop()
    tasks = list()
    tasks.append(loop.create_task(resolve(domain_to_brute, 'NS')))
    tasks.append(loop.create_task(resolve(domain_to_brute, 'MX')))
    loop.run_until_complete(asyncio.wait(tasks))

    futures = list()

    for t in tasks:
        for domain_name in t.result():
            name = resolver.query(domain_name, 'A')
            name.add_done_callback(error_checker_callback)
            name.data = domain_name
        futures.append(name)

    result = loop.run_until_complete(asyncio.wait(futures))

'''
    with open('test-dict.txt', 'r') as wordlist_file:
        subdomains = map(lambda x: x.strip(), wordlist_file.readlines())



'''
time_start = time.time()
start_dnscan(domain_to_brute)
print(time.time() - time_start)
