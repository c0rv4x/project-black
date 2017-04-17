import black
from black.workers.dirsearch.db_save import save_file


class Saver(object):
    def __init__(self, task_id, project_uuid):
        self.task_id = task_id
        self.project_uuid = project_uuid

    def save(self, url, status, response):
        special_info = None
        if status in [301, 302, 307] and 'location' in [h.lower() for h in response.headers]:
            special_info = response.headers['location']

        save_file(url, status, len(response), self.task_id, self.project_uuid, special_info=special_info)
