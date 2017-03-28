""" Module keeps ScopeManager, which creates/deletes/updates scopes.
Scope can be represented with ip_address, or hostname.
Hostname can have ip_address as a parameter (ForeignKey in the DB).
Ip_address can contain hostname (if they are known), which is in fact
a one->many relationship in the SQLalchemy. """
import uuid
import socket
import dns.resolver

from black.black.db import sessions, IP_addr
from black.black.db import Host as HostDB
from managers.scopes.ip import IP
from managers.scopes.host import Host as HostInstance


class ScopeManager(object):
    """ ScopeManager keeps track of all ips in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.ips = []
        self.hosts = []
        self.update_from_db()

    def get_ips(self):
        """ Returns all existing ips objects, serialized """
        return list(map(lambda x: x.toJSON(), self.ips))

    def get_hosts(self):
        """ Returns all existing hosts objects, serialized """
        return list(map(lambda x: x.toJSON(), self.hosts))

    def get_scopes(self):
        """ Returns all existing ips objects """
        return self.get_ips()

    def update_from_db(self):
        """ Extract all the ips from the DB """
        session = sessions.get_new_session()
        ips_from_db = session.query(IP_addr).all()
        self.ips = list(map(lambda x: IP(x.ip_id,
                                         x.ip_address,
                                         list(map(lambda x: x.hostname, x.hostnames)),
                                         x.comment,
                                         x.project_uuid),
                            ips_from_db))

        hosts_from_db = session.query(HostDB).all()
        self.hosts = list(map(lambda x: HostInstance(x.host_id,
                                                     x.hostname,
                                                     list(map(lambda x: x.ip_address, x.ip_addresses)),
                                                     x.comment,
                                                     x.project_uuid),
                              hosts_from_db))

        sessions.destroy_session(session)

    def find_ip(self, ip_address, project_uuid):
        """ Checks whether ip object for a certain project already exitst """
        filtered = self.ips
        filtered = list(filter(lambda x: x.get_project_uuid() == project_uuid, filtered))
        filtered = list(filter(lambda x: x.get_ip_address() == ip_address, filtered))

        return len(filtered) > 0

    def find_host(self, hostname, project_uuid):
        """ Checks whether host object for a certain project already exitst """
        filtered = self.hosts
        filtered = list(filter(lambda x: x.get_project_uuid() == project_uuid, filtered))
        filtered = list(filter(lambda x: x.get_hostname() == hostname, filtered))

        return len(filtered) > 0

    def create_scope_internal(self, ip_address, hostname, project_uuid):
        """ Creates a scope for a certain project.
        Either ip_address or hostname MUST be None.
        If ip_address is specified, the funciton creates IP object,
        If hostname is specified, the function creates Host object """
        if ip_address:
            if not self.find_ip(ip_address, project_uuid):
                new_scope_ip = IP(str(uuid.uuid4()), ip_address, [], "", project_uuid)
                result = new_scope_ip.save()

                if result['status'] == 'success':
                    self.ips.append(new_scope_ip)

                    return {
                        'status': 'success',
                        'type': 'ip_address',
                        'new_scope': new_scope_ip
                    }
                else:
                    print(result)
                    return result
            else:
                return {
                    'status': 'duplicate'
                }

        elif hostname:
            if not self.find_host(hostname, project_uuid):
                new_scope_host = HostInstance(str(uuid.uuid4()), hostname, None, "", project_uuid)
                result = new_scope_host.save()

                if result['status'] == 'success':
                    print(new_scope_host)
                    self.hosts.append(new_scope_host)

                    return {
                        'status': 'success',
                        'type': 'hostname',
                        'new_scope': new_scope_host
                    }
                else:
                    print(result)
                    return result
            else:
                return {
                    'status': 'duplicate'
                }
        else:
            raise Exception("Somehitng really bad happened")

    def create_scope(self, ip_address, hostname, project_uuid):
        """ This function creates a scope AND serializes it to json """
        result = self.create_scope_internal(ip_address, hostname, project_uuid)

        if result["status"] == "success":
            result['new_scope'] = result['new_scope'].toJSON()

        return result

    def delete_scope(self, scope_id):
        """ Delete a scope with a certain scope_id"""
        for ip_addr in self.ips:
            if ip_addr.get_id() == scope_id:
                self.ips.remove(ip_addr)
                del_result = ip_addr.delete()

                return del_result

        for host in self.hosts:
            if host.get_id() == scope_id:
                self.hosts.remove(host)
                del_result = host.delete()

                return del_result

    def update_scope(self, scope_id, comment):
        """ Update scope by its id. Now we can update only comment.
        Some more features are comming next. """
        for ip_addr in self.ips:
            if ip_addr.get_id() == scope_id:
                update_result = ip_addr.update_comment(comment)
                update_result['updated_scope'] = ip_addr.toJSON()
                update_result['type'] = 'ip'

                return update_result

        for host in self.hosts:
            if host.get_id() == scope_id:
                update_result = host.update_comment(comment)
                update_result['updated_scope'] = host.toJSON()
                update_result['type'] = 'host'

                return update_result

    def resolve_scopes(self, scopes_ids, project_uuid):
        """ Using all the ids of scopes, resolve the hosts, now we
        resolve ALL the scopes, that are related to the project_uuid """
        def try_connecection_to_ns(nameserver):
            """ Check if ns is reachable """
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                sock.connect((nameserver, 53))
            except socket.error as e:
                print('Error connecting to the NS')
            sock.close()

        resolver = dns.resolver.Resolver()
        resolver.nameservers = ['8.8.8.8']
        try_connecection_to_ns('8.8.8.8')

        for host in self.hosts:
            if host.get_project_uuid() == project_uuid:
                if scopes_ids is None:
                    to_resolve = self.hosts
                else:
                    to_resolve = list(filter(lambda x: x.get_id() in scopes_ids, self.hosts))

        for host in to_resolve:
            self.resolve_single_host(host, project_uuid, resolver)


    def resolve_single_host(self, host, project_uuid, resolver):
        project_uuid = host.get_project_uuid()
        hostname = host.get_hostname()

        if hostname:
            try:
                answers = resolver.query(hostname, 'A').response.answer

                # Iterate over answers from nses
                for answer in answers:
                    # Iterate over ips in the answer
                    for address in answer:
                        # Lets find if the new IP already exists in the DB
                        new_ip = str(address)
                        found_ips = list(filter(lambda x: x.get_ip_address() == new_ip and 
                                                       x.get_project_uuid() == project_uuid,
                                         self.ips))
                        if len(found_ips) == 0:
                            # Lets crete such ip
                            create_result = self.create_scope_internal(new_ip, None, project_uuid)

                            if create_result['status'] == 'success':
                                newly_created_ip = create_result['new_scope']
                                host.append_ip(newly_created_ip)
                        else:
                            # Such ip already exists
                            existing_ip = found_ips[0]
                            host.append_ip(existing_ip)

            except dns.resolver.NXDOMAIN as e:
                return {
                    "status": "error",
                    "text": "No such domain"
                }
