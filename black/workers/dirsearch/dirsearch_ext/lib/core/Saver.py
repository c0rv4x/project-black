import uuid
import urllib
from black.db import Sessions, FileDatabase

class Saver(object):
    def __init__(self, task_id, project_uuid):
        self.task_id = task_id
        self.project_uuid = project_uuid

        self.sessions = Sessions()

    def save(self, url, status, response):
        special_note = None
        if status in [301, 302, 307] and 'location' in [h.lower() for h in response.headers]:
            special_note = response.headers['location']

        self.save_file(url, status, len(response), self.task_id, self.project_uuid, special_note=special_note)

    def save_file(self, url, status_code, content_length, task_id, project_uuid, special_note=None):
        try:
            parsed_url = urllib.parse.urlparse(url)
            try:
                target = parsed_url.netloc.split(':')[0]
            except Exception as exc:
                print(exc, 'during target parsing')
                target = parsed_url.netloc

            port_number = int(parsed_url.netloc.split(':')[1])

            file_name = parsed_url.path

            session = self.sessions.get_new_session()
            new_file = FileDatabase(
                file_id=str(uuid.uuid4()),
                file_name=file_name,
                target=target,
                port_number=port_number,
                file_path=url,
                status_code=status_code,
                content_length=content_length,
                special_note=special_note,
                task_id=task_id,
                project_uuid=project_uuid
            )

            session.add(new_file)
            session.commit()

            self.sessions.destroy_session(session)
        except Exception as e:
            print(e)