import base64

from sanic import response

from server.handlers.utils import authorized_class_method
from black.db.models.dictionary import DictDatabase


class DictHandlers:
    def __init__(self, dict_manager):
        self.dict_manager = dict_manager


    @authorized_class_method()
    async def cb_upload_dict(self, request):
        dict_params = request.json
        content = base64.b64decode(dict_params["content"]).decode()
        save_result = self.dict_manager.create(
            name=dict_params["name"],
            dict_type=dict_params["dict_type"],
            content=content,
            project_uuid=int(dict_params["project_uuid"])
        )

        if save_result["status"] == "success":
            save_result["dictionary"] = save_result["dictionary"].dict()

            return response.json(save_result, status=200)
        return response.json(save_result, status=500)


    @staticmethod
    @authorized_class_method()
    async def cb_get_dictionary(request, dict_id):
        get_result = DictDatabase.get(dict_id=dict_id)

        if get_result["status"] == "success":
            if len(get_result["dicts"]) == 0:
                return response.text("Dictionary not found", status=200)
            else:
                return response.text(get_result["dicts"][0].content, status=200)
        else:
            return response.text(get_result, status=500)

