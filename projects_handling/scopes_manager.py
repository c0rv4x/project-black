import uuid

from black.black.db import sessions, Project, Scope


class ScopeManager(object):
    """ ScopeManager keeps track of all scopes in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.scopes = [{
            "hostname": "somehostname",
            "ip_address": "1.2.2.2",
            "scope_id": str(uuid.uuid4()),
            "project_name": "proj_name_1"
        }, {
            "hostname": "sdf",
            "ip_address": "1.2.3.2",
            "scope_id": str(uuid.uuid4()),
            "project_name": "sdf"
        }]

    def get_scopes(self):
        """ Returns the list of scopes """
        return self.scopes

    def find_scope(self, hostname=None, ip_address=None, project_name=None, scope_id=None):
        """ Serach for a scope with a specific name """
        filtered = self.scopes

        if hostname:
            filtered = list(filter(lambda x: x['hostname'] == hostname, filtered))

        if ip_address:
            filtered = list(filter(lambda x: x['ip_address'] == ip_address, filtered))

        if project_name:
            filtered = list(filter(lambda x: x['project_name'] == project_name, filtered))

        if scope_id:
            filtered = list(filter(lambda x: x['scope_id'] == scope_id, filtered))

        return filtered

    def create_scope(self, hostname, ip_address, project_name, scope_id=None):
        """ Creates a new scope """
        found_scopes = self.find_scope(hostname=hostname, ip_address=ip_address, project_name=project_name)

        if len(found_scopes) == 0:
            ready_scope_id = scope_id or str(uuid.uuid4())

            try: 
                session = sessions.get_new_session()
                new_scope = Scope(scope_id=ready_scope_id,
                                  hostname=hostname,
                                  ip_address=ip_address,
                                  project_name=project_name)
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
                "project_name": project_name
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

    def delete_scope(self, hostname=None, ip_address=None, project_name=None, scope_id=None):
        """ Deletes a new scope """
        filtered_scopes = self.find_scope(hostname, ip_address, project_name, scope_id)

        if len(filtered_scopes) != 0:
            for to_delete in filtered_scopes:
                # Remove the scope from everywhere
                try: 
                    session = sessions.get_new_session()
                    db.obj = session.query(Scope).filter_by(scope_id=to_delete['scope_id']).first()
                    session.delete(db_obj)
                    session.commit()
                    sessions.destroy_session(session)

                    self.scopes.remove(to_delete)
                except Exception as e:
                    print(e)
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
