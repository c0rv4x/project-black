import asyncio
import aiodns
import time
import json
import itertools
from collections import defaultdict

from black.workers.common.async_task import AsyncTask
from .save import save

domain_to_brute = 'anatoly.tech'


class DNSScanTask(AsyncTask):
    """ Major class for working with dnsscan """

    def __init__(self, task_id, target, params, project_uuid):
        print(1)

        AsyncTask.__init__(self, task_id, 'dnsscan', target, params, project_uuid)
        # program_params = params['program']
        # self.params_object = program_params

        self.request_queue = asyncio.Queue()
        self.resolver = aiodns.DNSResolver()

        self.pool_size = 10

        self.new_ips_ids = list()
        self.new_hosts_ids = list()

    def send_notification(self, command):
        """ Sends 'command' notification to the current process. """
        # if command == 'pause':
        #     self.proc.send_signal(signal.SIGSTOP.value)  # SIGSTOP
        # elif command == 'stop':
        #     self.proc.terminate()  # SIGTERM
        # elif command == 'unpause':
        #     self.proc.send_signal(signal.SIGCONT.value)  # SIGCONT

    async def wait_for_exit(self):
        """ Check if the process exited. If so,
        save stdout, stderr, exit_code and update the status. """

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

            if dns_record['value'] is not None:
                domain_name = dns_record['value']
            else:
                break

            record_type = dns_record['type']
            resolved = self.resolver.query(domain_name, record_type)
            resolved.add_done_callback(self.resolve_callback)
            resolved.domain_name = domain_name
            records.append(resolved)

        await asyncio.wait(records)

        return records

    def resolve_callback(self, future):
        print("resolve callback")
        if future.exception():
            exc = future.exception()
            errno = exc.args[0]

            if errno != 4:
                print("#{}, {}".format(errno, exc.args[1])) 
                #self.request_queue.put_nowait(future.domain_name)
        else:
            result = defaultdict(list)
            for res in future._result:
                result[future.domain_name].append(res.host)
                result = save(future.domain_name, res.host, self.task_id, self.project_uuid)

                self.new_ips_ids.append(result["ip_id"])
                self.new_hosts_ids.append(result["host_id"])

            print(result)

    async def start(self):
        loop = asyncio.get_event_loop()
        self.set_status("Working")
        # tasks = list()
        # tasks.append(loop.create_task(self.resolve(self.target, 'NS')))
        # tasks.append(loop.create_task(self.resolve(self.target, 'MX')))
        # # result = loop.run_until_complete(asyncio.wait(tasks))
        # result = await asyncio.wait(tasks)

        # futures = list()

        # for task in tasks:
        #     print(task)
        #     for domain_name in task.result():
        #         resolved = self.resolver.query(domain_name, 'A')
        #         resolved.add_done_callback(self.resolve_callback)
        #         resolved.domain_name = domain_name
        #     futures.append(resolved)

        # # result = loop.run_until_complete(asyncio.wait(futures))
        # result = await asyncio.wait(futures)

        with open('test-dict.txt', 'r') as wordlist_file:
            subdomains = map(lambda x: x.strip() + '.' + self.target, wordlist_file.readlines())

        iterator = [iter(subdomains)] * self.pool_size
        splitted_subdomains = itertools.zip_longest(*iterator)

        for part in list(splitted_subdomains):
            for item in part:
                # loop.run_until_complete(self.request_queue.put({
                await self.request_queue.put({
                    'type': 'A',
                    'value': item
                })
            # result = loop.run_until_complete(self.resolve_item_from_queue())
            result = await self.resolve_item_from_queue()

        self.set_status("Finished", progress=100, text=json.dumps({
            "new_ips_ids": self.new_ips_ids,
            "new_hosts_ids": self.new_hosts_ids
        }))

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


# time_start = time.time()
# scaner = DNSScanTask(domain_to_brute)
# scaner.start_dnscan()
# print(time.time() - time_start)
