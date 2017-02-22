import asyncio
import aiodns
# from pycares.errno import errorcode

domain_to_brute = 'iamiad.com'


def error_checker_callback(future):
    if future.exception():
        exc = future.exception()
        errno = exc.args[0]
        if errno != 4:
            print("#{}, {}".format(errno, exc.args[1]))
    else:
        print(future.data)

# print(errorcode)


def start_dnscan(domain):
    with open('wordlist.txt', 'r') as wordlist_file:
        subdomains = map(lambda x: x.strip(), wordlist_file.readlines())

    loop = asyncio.get_event_loop()
    resolver = aiodns.DNSResolver(loop=loop)
    futures = list()

    for subdomain in subdomains:
        name = resolver.query(subdomain + '.' + domain, 'A')
        name.add_done_callback(error_checker_callback)
        name.data = subdomain + '.' + domain
        futures.append(name)

    result = loop.run_until_complete(asyncio.wait(futures))

start_dnscan(domain_to_brute)
