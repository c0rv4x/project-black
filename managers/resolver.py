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
    def __init__(self, nameservers=['8.8.8.8']):
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
