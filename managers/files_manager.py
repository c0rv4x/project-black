""" Keeps FileManager, which is reponsible for working with File table """
from operator import itemgetter

from black.black.db import Sessions, FileDatabase, ProjectDatabase


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.sessions = Sessions()

    def count(self, project_uuid=None):
        assert project_uuid is not None

        session = self.sessions.get_new_session()

        amount = session.query(FileDatabase).filter(FileDatabase.project_uuid == project_uuid).count()

        self.sessions.destroy_session(session)

        return amount
