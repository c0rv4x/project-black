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
        self.update_from_db()

    def get_ips(self):
        """ Returns the list of ips """
        return self.ips

    def get_ips(self):
        return list(map(lambda x: x.toJSON(), self.ips))

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
        pending_hosts = list(filter(lambda x: x.ip_address == None, hosts_from_db))
        self.pending_hosts = list(map(lambda x: Host(x.host_id,
                                                     None, # ip_address
                                                     [x.hostname], # a list of hostnames
                                                     x.comment,
                                                     x.project_uuid),
                                      pending_hosts))

        sessions.destroy_session(session)  

    def create_scope(self, ip_address, hostname, project_uuid):
        if ip_address:
            new_scope = IP(str(uuid.uuid4()), ip_address, [], "", project_uuid)
            result = new_scope.save()

            if result['status'] == 'success':
                self.ips.append(new_scope)

                return {
                    'status': 'success',
                    'new_scope': new_scope.toJSON()
                }
            else:
                print(result)
                return result

        elif hostname:
            raise Exception("Not implemented yet")
            pass
        else:
            raise Exception("Somehitng really bad happened")

