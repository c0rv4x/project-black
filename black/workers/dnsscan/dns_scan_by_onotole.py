""" DNScan module. Brute forces A and AAAA DNS records of target domain """
import time
import asyncio
import aiodns

from db import create_db, store_record_project, store_record_dnscan


class DNScan(object):
    """ DNScan class """
    def __init__(self, project_name, init_points):
        self.subdomains = None
        self.resolver = None
        self.db_tasks = None
        self.project_name = project_name
        self.init_points = init_points

    async def dns_worker(self, project_name, hostname):
        """ Async worker that bruteforces DNS record based on the hostname """
        wait_for = []

        for subdomain in self.subdomains:
            result = self.resolver.query(subdomain + '.' + hostname, 'A')
            result.data = {
                "hostname": subdomain + '.' + hostname,
                "type": "A",
                "project_name": project_name
            }
            result.add_done_callback(self.printer_callback)
            result.add_done_callback(self.saver_callback)
            wait_for.append(result)

            result = self.resolver.query(subdomain + '.' + hostname, 'AAAA')
            result.data = {
                "hostname": subdomain + '.' + hostname,
                "type": "AAAA",
                "project_name": project_name
            }
            result.add_done_callback(self.printer_callback)
            result.add_done_callback(self.saver_callback)
            wait_for.append(result)

        # Waiting for all dns query to be performed
        await asyncio.wait(wait_for)

        # Waiting for all tasks to be done
        await self.db_tasks.join()
        self.db_tasks.put_nowait('Stop')

    async def db_worker(self):
        while True:
            future = await self.db_tasks.get()

            if future == 'Stop':
                break

            # Saving query result to DB
            data = future.data

            ips_list = map(lambda x: x.host, future.result())

            for ip_addr in set(ips_list):
                await store_record_dnscan(data['type'], ip_addr, data['hostname'], data['project_name'])

            self.db_tasks.task_done()

    def printer_callback(self, future):
        """ Called, when a resolver got a future to print the result """
        if not future.exception():
            print(str(future.data) + "\n" + str(future.result()) + "\n")

    def saver_callback(self, future):
        if not future.exception():
            self.db_tasks.put_nowait(future)

    async def start_dnscan(self):
        with open('./dnscan/wordlist.txt', 'r') as wordlist_file:
            self.subdomains = map(lambda x: x.strip(), wordlist_file.readlines())

        time_start = time.time()

        await create_db()
        await store_record_project(self.project_name, self.init_points)

        self.db_tasks = asyncio.Queue()

        self.resolver = aiodns.DNSResolver(loop=asyncio.get_event_loop())
        await asyncio.wait([
            self.dns_worker(self.project_name, self.init_points),
            self.db_worker()
        ])

        print(time.time() - time_start)
