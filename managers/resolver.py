import re
import socket
import dns.resolver


class ResolverException(Exception):
    def __init__(self):
        pass


class ResolverTimeoutException(ResolverException):
    def __init__(self):
        pass    


class Resolver(object):
    def __init__(self, task_queue, result_queue, nameservers=['8.8.8.8']):
        self.task_queue = task_queue
        self.result_queue = result_queue

        self.resolver = dns.resolver.Resolver()
        self.nameservers = nameservers
        self.resolver.nameservers = nameservers
        self.try_connection()

    def try_connection(self):
        """ Check if ns is reachable """

        # TODO: check not one nameserver, but all of them
        nameserver = self.nameservers[0]
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.connect((nameserver, 53))
        except socket.error as e:
            sock.close()
            raise ResolverTimeoutException
        else:
            sock.close()

    def start_resolving(self):
        while not self.task_queue.empty():
            host = self.task_queue.get()
            self.resolve_single_host(host)


    def resolve_single_host(self, host):
        project_uuid = host.get_project_uuid()
        hostname = host.get_hostname()

        if hostname:
            try:
                answers = self.resolver.query(hostname, 'A').response.answer

                # Iterate over answers from nses
                for answer in answers:
                    # Iterate over ips in the answer
                    for address in answer:
                        # Lets find if the new IP already exists in the DB
                        new_ip = str(address)
                        if not re.match(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', new_ip):
                            continue

                        self.result_queue.put_nowait((host, new_ip, project_uuid))

            except dns.resolver.NXDOMAIN as e:
                return {
                    "status": "error",
                    "text": "No such domain"
                }
            except Exception as e:
                print("Exception during resolve: {}".format(str(e)), e)