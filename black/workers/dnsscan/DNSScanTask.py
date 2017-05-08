import asyncio
import aiodns
import time
import itertools
# from pycares.errno import errorcode

domain_to_brute = 'anatoly.tech'


class DNSScanTask(object):
    def __init__(self, target):
        self.target = target
        self.request_queue = asyncio.Queue()
        self.resolver = aiodns.DNSResolver()

        self.pool_size = 10

    async def resolve(self, domain, record_type):
        records = list()
        name = await self.resolver.query(domain, record_type)

        for n in name:
            records.append(n.host)

        return records

    async def resolve_item_from_queue(self):
        records = list()

        while not self.request_queue.empty():
            dns_record = self.request_queue.get_nowait()

            if dns_record['value'] != None:
                domain_name = dns_record['value']
            else:
                break

            record_type = dns_record['type']
            name = self.resolver.query(domain_name, record_type)
            name.add_done_callback(self.error_checker_callback)
            name.domain_name = domain_name
            records.append(name)

        await asyncio.wait(records)

        return records

    def error_checker_callback(self,future):
        if future.exception():
            exc = future.exception()
            errno = exc.args[0]

            if errno != 4:
                print("#{}, {}".format(errno, exc.args[1])) 
                #self.request_queue.put_nowait(future.domain_name)
        else:
            result = list(map(lambda x: (future.domain_name, x.host), future._result))
            print(result)

    def start_dnscan(self):
        loop = asyncio.get_event_loop()
        tasks = list()
        tasks.append(loop.create_task(self.resolve(self.target, 'NS')))
        tasks.append(loop.create_task(self.resolve(self.target, 'MX')))
        result = loop.run_until_complete(asyncio.wait(tasks))
        futures = list()

        for task in tasks:
            for domain_name in task.result():
                name = self.resolver.query(domain_name, 'A')
                name.add_done_callback(self.error_checker_callback)
                name.domain_name = domain_name
            futures.append(name)

        result = loop.run_until_complete(asyncio.wait(futures))

        with open('test-dict.txt', 'r') as wordlist_file:
            subdomains = map(lambda x: x.strip() + '.' + self.target, wordlist_file.readlines())

        iterator = [iter(subdomains)] * self.pool_size
        splitted_subdomains = itertools.zip_longest(*iterator)
        #i = 0
        #j = len(list(splitted_subdomains))
        #print(list(splitted_subdomains)[-1])
        for part in list(splitted_subdomains):
            #i = i + 1
            #print("{}/{}".format(i,j))
            for item in part:
                loop.run_until_complete(self.request_queue.put({
                    'type': 'A',
                    'value': item
                }))
            result = loop.run_until_complete(self.resolve_item_from_queue())

        '''
        futures = list()

        for t in tasks:
            for domain_name in t.result():
                name = resolver.query(domain_name, 'A')
                name.add_done_callback(self.error_checker_callback)
                name.domain_name = domain_name
            futures.append(name)

        result = loop.run_until_complete(asyncio.wait(futures))

        futures = list()

        for domain_name in subdomains:
            name = resolver.query(domain_name + '.' + domain, 'A')
            name.add_done_callback(error_checker_callback)
            name.domain_name = domain_name
            print(domain_name)
            futures.append(name)

            if len(futures) >= self.pool_size:
                result = loop.run_until_complete(asyncio.wait(futures))
                futures = list()
        '''


time_start = time.time()
scaner=DNSScanTask(domain_to_brute)
scaner.start_dnscan()
print(time.time() - time_start)
