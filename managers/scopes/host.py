from black.black.db import sessions
from black.black.db import Host as HostDB


class Host(object):
    def __init__(self, _id, hostname, comment, project_uuid):
        self._id = _id
        self.hostname = hostname
        self.comment = comment
        self.project_uuid = project_uuid

    def get_id(self):
        return self._id

    def get_hostname(self):
        return self.hostname

    def get_comment(self):
        return self.comment

    def get_project_uuid(self):
        return self.project_uuid

    def toJSON(self):
        return {
            'type': 'host',
            '_id': self.get_id(),
            'hostname': self.get_hostname(),
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
