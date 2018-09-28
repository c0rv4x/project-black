import uuid
import urllib
from black.db import Sessions, FileDatabase, IPDatabase, HostDatabase

class Saver(object):
    def __init__(self, task_id, project_uuid):
        self.task_id = task_id
        self.project_uuid = project_uuid
        self.target_db_reference = None

        self.session_spawner = Sessions()

    def get_id(self, target):
        if self.target_db_reference is None:
            with self.session_spawner.get_session() as session:
                host_id = (
                    session.query(
                        HostDatabase.id
                    ).filter(
                        HostDatabase.target == target
                    ).one_or_none()
                )

                if host_id is not None:
                    ip_id = None
                else:
                    ip_id = (
                        session.query(
                            IPDatabase.id
                        ).filter(
                            IPDatabase.target == target
                        ).one_or_none()
                    )      
            self.target_db_reference = (ip_id, host_id)

        return self.target_db_reference

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

            ip_id, host_id = self.get_id(target)

            with self.session_spawner.get_session() as session:
                new_file = FileDatabase(
                    file_id=str(uuid.uuid4()),
                    file_name=file_name,
                    host_id=host_id,
                    ip_id=ip_id,
                    port_number=port_number,
                    file_path=url,
                    status_code=status_code,
                    content_length=content_length,
                    special_note=special_note,
                    task_id=task_id,
                    project_uuid=project_uuid
                )

                session.add(new_file)
        except Exception as e:
            print(e)