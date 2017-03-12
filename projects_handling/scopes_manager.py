import uuid


class ScopeManager(object):
    """ ScopeManager keeps track of all scopes in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.scopes = [{
            "hostname": "somehostname",
            "IP": "1.2.2.2",
            "scopeID": str(uuid.uuid4()),
            "projectName": "proj_name_1"
        }, {
            "hostname": "sdf",
            "IP": "1.2.3.2",
            "scopeID": str(uuid.uuid4()),
            "projectName": "sdf"
        }]

    def get_scopes(self):
        """ Returns the list of scopes """
        return self.scopes

    def find_scope(self, hostname=None, IP=None, projectName=None, scopeID=None):
        """ Serach for a scope with a specific name """
        filtered = self.scopes

        if hostname:
            filtered = list(filter(lambda x: x['hostname'] == hostname, filtered))

        if IP:
            filtered = list(filter(lambda x: x['IP'] == IP, filtered))

        if projectName:
            filtered = list(filter(lambda x: x['projectName'] == projectName, filtered))

        if scopeID:
            filtered = list(filter(lambda x: x['scopeID'] == scopeID, filtered))

        return filtered

    def create_scope(self, hostname, IP, projectName, scopeID=None):
        """ Creates a new scope """
        found_scopes = self.find_scope(hostname=hostname, IP=IP, projectName=projectName)

        if found_scopes == 0:
            scope = {
                "hostname": hostname,
                "IP": IP,
                "scopeID": scopeID or str(uuid.uuid4()),
                "projectName": projectName
            }

            # Append the new scope to existing
            self.scopes.append(scope)

            return {
                "status": "success",
                "new_scope": scope
            }
        else: 
            return {
                "status": "error",
                "text": 'That specific scope already exists.',
                "found_scope": found_scopes[0]
            }

    def delete_scope(self, hostname=None, IP=None, projectName=None, scopeID=None):
        """ Deletes a new scope """
        filtered_scopes = self.find_scope(hostname, IP, projectName, scopeID)

        if len(filtered_scopes) != 0:
            for to_delete in filtered_scopes:
                # Remove the scope from everywhere
                self.scopes.remove(to_delete)

            return {
                "status": "success"
            }
        else: 
            return {
                "status": "error",
                "text": 'No such scopes.'
            }
