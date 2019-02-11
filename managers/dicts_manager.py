from functools import reduce

from black.db import Sessions, DictDatabase


class DictManager(object):
    def __init__(self):
        self.sessions = Sessions()
        self.dicts = []

        self.fetch_dicts()

    def fetch_dicts(self):
        get_result = DictDatabase.get()

        if get_result["status"] == "success":
            self.dicts = list(map(lambda x: x.dict(), get_result["dicts"]))

            for i in range(len(self.dicts)):
                self.dicts[i]["content"] = ''
        else:
            raise Exception(get_result)

    def count(self, project_uuid):
        return DictDatabase.count(project_uuid)

    def create(self, name, dict_type, content, project_uuid):
        create_result = DictDatabase.create(name, dict_type, content, project_uuid)

        if create_result["status"] == "success":
            new_dict = create_result["dictionary"].dict()
            new_dict["content"] = ""

            self.dicts.append(new_dict)

        return create_result

    def get(self, project_uuid=None):
        return {
            "project_uuid": project_uuid,
            "status": "success",
            "dicts": list(filter(
                lambda a: a["project_uuid"] == project_uuid,
                self.dicts
            ))
        }

    def delete(self, project_uuid, dict_id=None, name=None):
        delete_result = DictDatabase.delete(project_uuid, dict_id, name)

        if delete_result["status"] == "success":
            self.dicts = list(filter(
                lambda x: x["dict_id"] != delete_result["dict_id"],
                self.dicts
            ))

        return delete_result
