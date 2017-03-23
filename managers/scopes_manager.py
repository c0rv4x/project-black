import uuid
import socket
import dns.resolver

from black.black.db import sessions, Scope


class ScopeManager(object):
    """ ScopeManager keeps track of all scopes in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.scopes = []
        self.update_from_db()

    def get_scopes(self):
        """ Returns the list of scopes """
        return self.scopes

    def update_from_db(self):
        """ Extract all the scopes from the DB """
        session = sessions.get_new_session()
        scopes_from_db = session.query(Scope).all()
        self.scopes = list(map(lambda x: {
                'hostname': x.hostname, 
                'ip_address': x.ip_address,
                'project_uuid': x.project_uuid,
                'scope_id': x.scope_id,
                'comment': x.comment
            }, 
            scopes_from_db))
        sessions.destroy_session(session)  

    def find_scope(self, hostname="N/A", ip_address="N/A", project_uuid="N/A", scope_id="N/A"):
        """ Serach for a scope with a specific name """
        filtered = self.scopes
        if hostname != "N/A":
            filtered = list(filter(lambda x: x['hostname'] == hostname, filtered))

        if ip_address != "N/A":
            filtered = list(filter(lambda x: x['ip_address'] == ip_address, filtered))

        if project_uuid != "N/A":
            filtered = list(filter(lambda x: x['project_uuid'] == project_uuid, filtered))

        if scope_id != "N/A":
            filtered = list(filter(lambda x: x['scope_id'] == scope_id, filtered))

        return filtered

    def create_scope(self, hostname, ip_address, project_uuid, scope_id=None, comment="test"):
        """ Creates a new scope """
        found_scopes = self.find_scope(hostname=hostname, ip_address=ip_address, project_uuid=project_uuid)

        if len(found_scopes) == 0:
            ready_scope_id = scope_id or str(uuid.uuid4())

            try: 
                session = sessions.get_new_session()
                new_scope = Scope(scope_id=ready_scope_id,
                                  hostname=hostname,
                                  ip_address=ip_address,
                                  project_uuid=project_uuid,
                                  comment=comment)
                session.add(new_scope)
                session.commit()
                sessions.destroy_session(session)
            except Exception as e:
                return {
                    "status": "error",
                    "text": str(e)
                }    

            scope = {
                "hostname": hostname,
                "ip_address": ip_address,
                "scope_id": ready_scope_id,
                "project_uuid": project_uuid,
                "comment": comment
            }

            # Append the new scope to existing
            self.scopes.append(scope)

            return {
                "status": "success",
                "new_scope": scope
            }
        else: 
            return {
                "status": "duplicate",
                "text": 'That specific scope already exists.',
                "new_scope": None
            }

    def delete_scope(self, hostname="N/A", ip_address="N/A", project_uuid="N/A", scope_id="N/A"):
        """ Deletes a new scope """
        filtered_scopes = self.find_scope(hostname, ip_address, project_uuid, scope_id)

        if len(filtered_scopes) != 0:
            for to_delete in filtered_scopes:
                # Remove the scope from everywhere
                try: 
                    session = sessions.get_new_session()
                    db_obj = session.query(Scope).filter_by(scope_id=to_delete['scope_id']).first()
                    session.delete(db_obj)
                    session.commit()
                    sessions.destroy_session(session)

                    self.scopes.remove(to_delete)
                except Exception as e:
                    return {
                        "status": "error",
                        "text": str(e)
                    }  


            return {
                "status": "success"
            }
        else: 
            return {
                "status": "error",
                "text": 'No such scopes.'
            }

    def resolve_single_scope(self, scope, resolver):
        project_uuid = scope['project_uuid']
        hostname = scope['hostname']

        if hostname:
            try:
                answers = resolver.query(hostname, 'A').response.answer
                for answer in answers:
                    for address in answer:
                        result = self.create_scope(hostname=hostname,
                                                   ip_address=str(address),
                                                   project_uuid=project_uuid)

                        if result["status"] == 'success':
                            self.delete_scope(hostname=hostname, ip_address=None)

            except dns.resolver.NXDOMAIN as e:
                return {
                    "status": "error",
                    "text": "No such domain"               
                }


    def resolve_scopes(self, project_uuid, scope_ids=None):
        def try_connecection_to_ns(ns):
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                s.connect((ns, 53))
            except socket.error as e:
                print('Error connecting to the NS')
                pass
            s.close()

        resolver = dns.resolver.Resolver()
        resolver.nameservers = ['8.8.8.8']
        try_connecection_to_ns('8.8.8.8')

        single_project_scopes = list(filter(lambda x: x['project_uuid'] == project_uuid, self.scopes))

        if scope_ids is None:
            to_resolve = single_project_scopes
        else:
            to_resolve = list(filter(lambda x: x['scope_id'] in scope_ids, single_project_scopes))

        for scope in to_resolve:
            self.resolve_single_scope(scope, resolver)

    def update_scope(self, scope_id, comment):
        """ For now, it updated only comment.
        Attention: we will update all the similar scopes with 
        that same comment. """
        try:
            session = sessions.get_new_session()
            scope_from_db = session.query(Scope).filter_by(scope_id=scope_id).first()

            hostname = scope_from_db.hostname
            ip_address = scope_from_db.ip_address

            similar_scopes_from_db = session.query(Scope).filter_by(
                hostname=hostname, 
                ip_address=ip_address).all()

            to_update_ids_local = list()
            for scope in similar_scopes_from_db:
                to_update_ids_local.append(scope.scope_id)
                scope.comment = comment

            session.commit()
            sessions.destroy_session(session)


            updated = dict()
            to_update_locally = list(filter(lambda x: x["scope_id"] in to_update_ids_local , self.get_scopes()))

            for local_scope in to_update_locally:
                local_scope["comment"] = comment
                updated[local_scope["scope_id"]] = local_scope

        except Exception as e:
            return {
                "status": "error",
                "text": str(e)
            }
        else:
            return {
                "status": "success",
                "updated_scopes": updated

            }
