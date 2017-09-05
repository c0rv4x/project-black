from black.black.db import sessions, IP_addr
from black.black.db import Host as HostDB


class IP(object):
    """ Class keeps data on a single IP. Related hostnames inside the project +
    comment on the ip """

    def __init__(self, ip_id, ip_address, project_uuid, hostnames=None, comment=""):
        self._id = ip_id
        self.ip_address = ip_address
        self.hostnames = hostnames or list()
        self.comment = comment
        self._project_uuid = project_uuid

    def get_id(self):
        """ Returns id of ip (read-only) """
        return self._id

    def get_ip_address(self):
        return self.ip_address

    def get_hostnames(self):
        return self.hostnames

    def get_comment(self):
        return self.comment

    def get_project_uuid(self):
        """ Returns project_uuid of ip (read-only) """
        return self._project_uuid
 
    def set_hostnames(self, new_hostnames):
        self.hostnames = new_hostnames

    def to_json(self):
        return {
            'type': 'ip',
            '_id': self.get_id(),
            'ip_address': self.get_ip_address(),
            'hostnames': list(map(lambda x: x.get_hostname(), self.get_hostnames())),
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
            print("error during savin ip")
            return {
                'status': 'error',
                'text': str(e)
            }

        else:
            return {
                'status': 'success'
            }

    def delete(self):
        try:
            session = sessions.get_new_session()
            db_object = session.query(IP_addr).filter_by(ip_id=self._id).first()
            session.delete(db_object)
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

    def update_comment(self, comment):
        try:
            session = sessions.get_new_session()
            db_object = session.query(IP_addr).filter_by(ip_id=self._id).first()
            db_object.comment = comment
            session.commit()
            sessions.destroy_session(session)        
        except Exception as e:
            return {
                'status': 'error',
                'text': str(e)
            }

        else:
            self.comment = comment

            return {
                'status': 'success'
            }


    def append_host(self, host_object):
        if host_object not in self.hostnames:
            self.hostnames.append(host_object)
            session = sessions.get_new_session()
            ip_from_db = session.query(IP_addr).filter_by(ip_id=self.get_id()).first()
            host_from_db = session.query(HostDB).filter_by(host_id=host_object.get_id()).first()
            ip_from_db.hostnames.append(host_from_db)

            session.commit()
            sessions.destroy_session(session)