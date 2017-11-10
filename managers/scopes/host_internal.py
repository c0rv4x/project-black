import uuid

from black.black.db import Sessions, HostDatabase, IPDatabase


class HostInternal(object):
    """ Class keeps data on a single Host. Related ips inside the project +
    comment on the hsot """

    def __init__(
        self,
        hostname,
        project_uuid,
        ip_addresses=None,
        comment="",
        host_id=None
    ):
        self.hostname = hostname
        self.ip_addresses = ip_addresses or list()
        self.comment = comment
        self.project_uuid = project_uuid

        self._id = host_id or str(uuid.uuid4())

        self.session_spawner = Sessions()

    def get_id(self):
        """ Returns current id """
        return self._id

    def get_hostname(self):
        """ Returns the hostname of this host """
        return self.hostname

    def get_ip_addresses(self):
        """ Returns ip addresses which current host resolves
        to """
        return self.ip_addresses

    def get_project_uuid(self):
        """ Returns the project uuid """
        return self.project_uuid

    def set_ip_addresses(self, new_ip_addresses):
        """ Sets ip addresses to which the current host resolves to """
        self.ip_addresses = new_ip_addresses

    def to_json(self):
        """ Serializes the object to json """
        return {
            'type':
                'host',
            '_id':
                self.get_id(),
            'hostname':
                self.get_hostname(),
            'ip_addresses':
                list(
                    map(
                        lambda ip_address: ip_address.get_ip_address(),
                        self.get_ip_addresses()
                    )
                ),
            'comment':
                self.comment,
            'project_uuid':
                self.get_project_uuid()
        }

    def save(self):
        try:
            session = self.session_spawner.get_new_session()
            db_object = HostDatabase(
                host_id=self.get_id(),
                hostname=self.get_hostname(),
                comment=self.comment,
                project_uuid=self.get_project_uuid()
            )
            session.add(db_object)
            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as exc:
            return {'status': 'error', 'text': str(exc)}

        else:
            return {'status': 'success'}

    def delete(self):
        try:
            session = self.session_spawner.get_new_session()
            db_object = session.query(HostDatabase).filter_by(host_id=self._id
                                                             ).first()
            session.delete(db_object)
            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as exc:
            return {'status': 'error', 'text': str(exc)}

        else:
            return {'status': 'success'}

    def update_comment(self, comment):
        try:
            session = self.session_spawner.get_new_session()
            db_object = session.query(HostDatabase).filter_by(host_id=self._id
                                                             ).first()
            db_object.comment = comment
            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as exc:
            return {'status': 'error', 'text': str(exc)}

        else:
            self.comment = comment

            return {'status': 'success'}

    def append_ip(self, ip_object):
        if ip_object not in self.ip_addresses:
            session = self.session_spawner.get_new_session()

            # Find the corresponding host
            host_from_db = session.query(HostDatabase).filter_by(
                host_id=self.get_id()
            ).first()

            # Find the corresponding ip
            ip_from_db = session.query(IPDatabase).filter_by(
                ip_id=ip_object.get_id()
            ).first()

            # Append ip to host
            host_from_db.ip_addresses.append(ip_from_db)

            session.commit()
            self.session_spawner.destroy_session(session)

            # If everything is ok, add that locally
            self.ip_addresses.append(ip_object)

    def remove_ip_address(self, ip_object):
        try:
            self.ip_addresses.remove(ip_object)
        except ValueError:
            pass
