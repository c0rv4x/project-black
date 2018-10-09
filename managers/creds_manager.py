""" Class keeps all projects list, allowing you to search it,
update, add, update and delete the elements. """
from black.db import CredDatabase


class CredManager(object):
    """ A proxy between database and UI handlers. Responsible
    for APIs for parsing credentials """

    def get_creds(self, project_uuid, targets=None, port_number=None):
        """ Returns the list of creds """
        find_result = CredDatabase.find(targets=targets, project_uuid=project_uuid, port_number=port_number)

        if find_result["status"] == "success":
            return {
                "status": "success",
                "creds": list(map(lambda x: x.dict(), find_result["creds"])),
                "project_uuid": project_uuid
            }

        return find_result

    def count(self, project_uuid):
        """ Counts the amount of creds records for a specific project """
        count_result = CredDatabase.count(project_uuid=project_uuid)

        if count_result["status"] == "success":
            return {
                "status": "success",
                "amount": count_result["amount"],
                "project_uuid": project_uuid
            }            

        return count_result

    def delete(self, project_uuid, targets, port_number):
        delete_result = CredDatabase.delete(project_uuid=project_uuid, targets=targets, port_number=port_number)

        if delete_result["status"] == "success":
            return {
                "status": "success",
                "project_uuid": project_uuid
            }

        return delete_result
