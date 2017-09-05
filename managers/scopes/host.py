from black.black.db import sessions, association_table, IP_addr
from black.black.db import Host as HostDB


class Host(object):
    def __init__(self, host_id, hostname, project_uuid, ip_addresses=None, comment=""):
        self._id = host_id
        self.hostname = hostname
        self.ip_addresses = ip_addresses or list()
        self.comment = comment
        self.project_uuid = project_uuid

    def get_id(self):
        return self._id

    def get_hostname(self):
        return self.hostname

    def get_ip_addresses(self):
        return self.ip_addresses

    def get_comment(self):
        return self.comment

    def get_project_uuid(self):
        return self.project_uuid

    def set_ip_addresses(self, new_ip_addresses):
        self.ip_addresses = new_ip_addresses

    def to_json(self):
        return {
            'type': 'host',
            '_id': self.get_id(),
            'hostname': self.get_hostname(),
            'ip_addresses': list(map(lambda x: x.get_ip_address(), self.get_ip_addresses())),
            'comment': self.get_comment(),
            'project_uuid': self.get_project_uuid()
        }

    def save(self):
        try:
            session = sessions.get_new_session()
            db_object = HostDB(host_id=self.get_id(),
                               hostname=self.get_hostname(),
                               comment=self.get_comment(),
                               project_uuid=self.get_project_uuid())
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

    def delete(self):
        try:
            session = sessions.get_new_session()
            db_object = session.query(HostDB).filter_by(host_id=self._id).first()
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
            db_object = session.query(HostDB).filter_by(host_id=self._id).first()
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

    def append_ip(self, ip_object):
        if ip_object not in self.ip_addresses:
            self.ip_addresses.append(ip_object)
            session = sessions.get_new_session()
            host_from_db = session.query(HostDB).filter_by(host_id=self.get_id()).first()
            ip_from_db = session.query(IP_addr).filter_by(ip_id=ip_object.get_id()).first()
            host_from_db.ip_addresses.append(ip_from_db)

            session.commit()
            sessions.destroy_session(session)
