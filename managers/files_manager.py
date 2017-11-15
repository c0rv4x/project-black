""" Keeps FileManager, which is reponsible for working with File table """
from operator import itemgetter

from black.black.db import Sessions, FileDatabase, ProjectDatabase


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.files = {}

        self.inited = {}

        self.sessions = Sessions()

        # self.update_from_db()

    def get_files(self, project_uuid):
        """ Returns the list of files """
        # self.update_from_db()

        if project_uuid is None:
            raise NotImplementedError

        if not self.inited.get(project_uuid, False):
            self.update_from_db(project_uuid)
            self.inited[project_uuid] = True

        return self.files.get(project_uuid, [])

    def update_from_db(self, project_uuid=None):
        """ Extract all the files from the DB.
        The structure is a dict. First level keys are project_uuids,
        second level keys - hosts """
        self.files = {}
        session = self.sessions.get_new_session()

        project_uuids = session.query(ProjectDatabase.project_uuid).all()

        if project_uuid is not None:
            project_uuids = [(project_uuid, )]

        for each_project_uuid_tupled in project_uuids:
            each_project_uuid = each_project_uuid_tupled[0]
            self.files[each_project_uuid] = {}

            targets = session.query(FileDatabase.target).filter(FileDatabase.project_uuid == each_project_uuid).distinct().all()

            for each_target in targets:
                host = each_target[0].split(':')[0]

                files_found = session.query(FileDatabase).filter(FileDatabase.target == host, FileDatabase.project_uuid == each_project_uuid).distinct(FileDatabase.file_path, FileDatabase.status_code).all()
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
