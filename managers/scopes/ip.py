from black.black.db import sessions, IP_addr


class IP(object):
    def __init__(self, _id, ip_address, hostnames, comment, project_uuid):
        self._id = _id
        self.ip_address = ip_address
        self.hostnames = hostnames or list()
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
            'type': 'ip',
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
