""" Keeps FileManager, which is reponsible for working with File table """
from operator import itemgetter

from black.black.db import sessions, FoundFile


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.files = []
        self.update_from_db()

    def get_files(self):
        """ Returns the list of files """
        self.update_from_db()

        return self.files

    def update_from_db(self):
        """ Extract all the files from the DB """
        self.files = []
        session = sessions.get_new_session()

        files_db = session.query(FoundFile).all()
        files = list(map(lambda x: {
            "file_id": x.file_id,
            "file_name": x.file_name,
            "target": x.target,
            "port_number": x.port_number,
            "file_path": x.file_path,
            "status_code": x.status_code,
            "content_length": x.content_length,
            "special_note": x.special_note,
            "task_id": x.task_id,
            "project_uuid": x.project_uuid,
            "date_added": str(x.date_added)
            }, files_db))
        files.sort(key=itemgetter("date_added"), reverse=True)

        unique_files = set()
        for file in files:
            file_n = file['file_path']

            if file_n not in unique_files:
                unique_files.add(file_n)
                self.files.append(file)

        sessions.destroy_session(session)
