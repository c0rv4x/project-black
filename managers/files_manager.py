""" Keeps FileManager, which is reponsible for working with File table """
from operator import itemgetter

from black.black.db import sessions, FoundFile


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.files = []
        self.update_from_db()

    def get_files(self, project_uuid):
        """ Returns the list of files """
        self.update_from_db()

        return list(filter(
            lambda x: project_uuid is None or x['project_uuid'] == project_uuid,
            self.files))

    def update_from_db(self):
        """ Extract all the files from the DB """
        self.files = []
        session = sessions.get_new_session()

        targets = session.query(FoundFile.target).distinct().all()
        
        for each_target in targets:
            host = each_target[0].split(':')[0]

            files_found = session.query(FoundFile).distinct(FoundFile.file_path, FoundFile.status_code).all()
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
                }, files_found))
            files.sort(key=itemgetter("status_code"))
            print(files)

        # unique_files = set()
        # for file in files:
        #     file_n = file['file_path']

        #     if file_n not in unique_files:
        #         unique_files.add(file_n)
        #         self.files.append(file)

        sessions.destroy_session(session)
