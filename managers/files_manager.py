""" Keeps FileManager, which is reponsible for working with File table """
from operator import itemgetter

from black.black.db import Sessions, FoundFile, Project


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.files = []

        self.sessions = Sessions()

        self.update_from_db()

    def get_files(self, project_uuid):
        """ Returns the list of files """
        # self.update_from_db()

        if project_uuid is None:
            raise NotImplementedError

        return self.files[project_uuid]

    def update_from_db(self):
        """ Extract all the files from the DB.
        The structure is a dict. First level keys are project_uuids,
        second level keys - hosts """
        self.files = {}
        session = self.sessions.get_new_session()

        project_uuids = session.query(Project.project_uuid).all()

        for each_project_uuid_tupled in project_uuids:
            each_project_uuid = each_project_uuid_tupled[0]
            self.files[each_project_uuid] = {}

            targets = session.query(FoundFile.target).filter(FoundFile.project_uuid == each_project_uuid).distinct().all()

            for each_target in targets:
                host = each_target[0].split(':')[0]

                files_found = session.query(FoundFile).filter(FoundFile.target == host, FoundFile.project_uuid == each_project_uuid).distinct(FoundFile.file_path, FoundFile.status_code).all()
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

                self.files[each_project_uuid][host] = files

        self.sessions.destroy_session(session)
