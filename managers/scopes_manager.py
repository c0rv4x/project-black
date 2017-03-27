import uuid
import socket
import dns.resolver

from black.black.db import sessions, IP_addr, Host


class IP(object):
    def __init__(self, _id, ip_address, hostnames, comment, project_uuid):
        self._id = _id
        self.ip_address = ip_address
        self.hostnames = hostnames
        self.comment = comment
        self.project_uuid = project_uuid

    def get_id(self):
        return self._id

    def get_ip_address(self):
        return self.ip_address

    def get_hostnames(self):
        return self.hostnames

    def get_comment(self):
        return self.comment

    def get_project_uuid(self):
        return self.project_uuid

    def toJSON(self):
        return {
            '_id': self.get_id(),
            'ip_address': self.get_ip_address(),
            'hostnames': self.get_hostnames(),
            'comment': self.get_comment(),
            'project_uuid': self.get_project_uuid()
        }

    def save(self):
        try:
            session = sessions.get_new_session()
            db_object = IP_addr(ip_id=self._id, 
                                ip_address=self.ip_address, 
                                comment=self.comment, 
                                project_uuid=self.project_uuid)
            session.add(db_object)
            session.commit()
            sessions.destroy_session(session)        
        except Exception as e:
            return {
                'status': 'error',
                'text': str(e)
            }

        else:
            return {
                'status': 'success'
            }

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

        # hosts_from_db = session.query(Host).all()
        # pending_hosts = list(filter(lambda x: x.ip_address == None, hosts_from_db))
        # self.pending_hosts = list(map(lambda x: Scope(x.host_id,
        #                                               None, # ip_address
        #                                               [x.hostname], # a list of hostnames
        #                                               x.comment,
        #                                               x.project_uuid),
        #                               pending_hosts))

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

