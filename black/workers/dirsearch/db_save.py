""" Keeps function for saving dirsearch file """
import uuid
from black.db import sessions, FoundFile


def save_file(url, status_code, content_length, task_id, project_uuid):
    parsed_url = urlparse(url)
    target = parsed_url.netloc
    scheme = parsed_url.scheme

    if scheme == 'https':
        port_number = 443
    else:
        port_number = 80

    file_name = parsed_url.path

    session = sessions.get_new_session()
    new_file = FoundFile(
        file_id=str(uuid.uuid4()),
        file_name=file_name,
        target=target,
        port_number=port_number,
        file_path=url,
        status_code=status_code,
        content_length=content_length,
        special_note=None,
        task_id=task_id,
        project_uuid=project_uuid
    )

    session.add(new_file)
    session.commit()

    sessions.destroy_session(session)  	