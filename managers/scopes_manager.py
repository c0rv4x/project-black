import uuid
import socket
import dns.resolver

from black.black.db import sessions, IP_addr, Host
from black.black.db import Host as HostDB
from managers.scopes.ip import IP
from managers.scopes.host import Host


class ScopeManager(object):
    """ ScopeManager keeps track of all ips in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.ips = []
        self.hosts = []
        self.update_from_db()

    def get_ips(self):
        return list(map(lambda x: x.toJSON(), self.ips))

    def get_hosts(self):
        return list(map(lambda x: x.toJSON(), self.hosts))

    def get_scopes(self):
        return self.get_ips()

    def update_from_db(self):
        """ Extract all the ips from the DB """
        session = sessions.get_new_session()
        ips_from_db = session.query(IP_addr).all()
        self.ips = list(map(lambda x: IP(x.ip_id,
                                         x.ip_address,
                                         x.hostnames,
                                         x.comment,
                                         x.project_uuid),
                            ips_from_db))

        hosts_from_db = session.query(HostDB).all()
        self.hosts = list(map(lambda x: Host(x.host_id,
                                             x.hostname,
                                             x.comment,
                                             x.project_uuid),
                                      hosts_from_db))

        sessions.destroy_session(session)  

    def find_ip(self, ip_address, project_uuid):
        filtered = self.ips
        filtered = list(filter(lambda x: x.get_project_uuid() == project_uuid, filtered))
        filtered = list(filter(lambda x: x.get_ip_address() == ip_address, filtered))

        return len(filtered) > 0

    def create_scope(self, ip_address, hostname, project_uuid):
        if ip_address:
            if not self.find_ip(ip_address, project_uuid):
                new_scope = IP(str(uuid.uuid4()), ip_address, [], "", project_uuid)
                result = new_scope.save()

                if result['status'] == 'success':
                    self.ips.append(new_scope)

                    return {
                        'status': 'success',
                        'type': 'ip_address',
                        'new_scope': new_scope.toJSON()
                    }
                else:
                    print(result)
                    return result
            else:
                return {
                    'status': 'duplicate'
                }

        elif hostname:
            new_scope = Host(str(uuid.uuid4()), hostname, "", project_uuid)
            result = new_scope.save()

            if result['status'] == 'success':
                self.hosts.append(new_scope)

                return {
                    'status': 'success',
                    'type': 'hostname',
                    'new_scope': new_scope.toJSON()
                }
            else:
                print(result)
                return result            
        else:
            raise Exception("Somehitng really bad happened")

