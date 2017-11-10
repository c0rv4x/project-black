import uuid

from black.black.db import Sessions, IPDatabase, HostDatabase


class IPInternal(object):
    """ Class keeps data on a single IP. Related hostnames inside the project +
    comment on the ip """

    def __init__(
        self, ip_address, project_uuid, hostnames=None, comment="", ip_id=None
    ):
        self.ip_address = ip_address
        self.hostnames = hostnames or list()
        self.comment = comment
        self._project_uuid = project_uuid

        self._id = ip_id or str(uuid.uuid4())

        self.session_spawner = Sessions()

    def get_id(self):
        """ Returns id of ip (read-only) """
        return self._id

    def get_ip_address(self):
        """ Returns ip address of the current scope"""
        return self.ip_address

    def get_hostnames(self):
        """ Returns a list of hostnames, which point to
        the current ip"""
        return self.hostnames

    def get_project_uuid(self):
        """ Returns project_uuid of ip (read-only) """
        return self._project_uuid

    def set_hostnames(self, new_hostnames):
        """ Sets a list of hostnames """
        self.hostnames = new_hostnames

    def to_json(self):
        """ Serialize the object to json """
        return {
            'type':
                'ip',
            '_id':
                self.get_id(),
            'ip_address':
                self.get_ip_address(),
            'hostnames':
                list(
                    map(
                        lambda hostname: hostname.get_hostname(),
                        self.get_hostnames()
                    )
                ),
            'comment':
                self.comment,
            'project_uuid':
                self.get_project_uuid()
        }

    def save(self, commit=True):
        if commit:
            try:
                session = self.session_spawner.get_new_session()

                db_object = IPDatabase(
                    ip_id=self.get_id(),
                    ip_address=self.get_ip_address(),
                    comment=self.comment,
                    project_uuid=self.get_project_uuid()
                )
                session.add(db_object)
                session.commit()
                self.session_spawner.destroy_session(session)
            except Exception as exc:
                print("Error while saving an ip", exc)
                return {'status': 'error', 'text': str(exc)}

            else:
                return {'status': 'success'}
        else:
            return IPDatabase(
                ip_id=self.get_id(),
                ip_address=self.get_ip_address(),
                comment=self.comment,
                project_uuid=self.get_project_uuid()
            )

    def delete(self):
        try:
            session = self.session_spawner.get_new_session()
            db_object = session.query(IPDatabase).filter_by(ip_id=self._id
                                                           ).first()
            session.delete(db_object)
            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as e:
            return {'status': 'error', 'text': str(e)}

        else:
            return {'status': 'success'}

    def update_comment(self, comment):
        try:
            session = self.session_spawner.get_new_session()
            db_object = session.query(IPDatabase).filter_by(ip_id=self._id
                                                           ).first()
            db_object.comment = comment
            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as e:
            return {'status': 'error', 'text': str(e)}

        else:
            self.comment = comment

            return {'status': 'success'}

    def append_host(self, host_object):
        """ Adds host to a list of known related hosts of the current ip """
        # TODO: should grab the result of saving
        if host_object not in self.hostnames:
            session = self.session_spawner.get_new_session()

            # Find db object which reflects the current ip
            ip_from_db = session.query(IPDatabase).filter_by(
                ip_id=self.get_id()
            ).first()

            # Find db object which reflect a new hostname
            host_from_db = session.query(HostDatabase).filter_by(
                host_id=host_object.get_id()
            ).first()

            # Append host to ip
            ip_from_db.hostnames.append(host_from_db)

            session.commit()
            self.session_spawner.destroy_session(session)

            # If no exception occured there, we will add it locally
            self.hostnames.append(host_object)

    def remove_host(self, host_object):
        try:
            self.hostnames.remove(host_object)
        except ValueError:
            pass
