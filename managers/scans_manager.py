""" Class that keeps info on scans """
from black.db import Sessions, ProjectDatabase, ScanDatabase


class ScanManager(object):
    def __init__(self):
        self.session_spawner = Sessions()

    def count(self, project_uuid=None):
        """ Count amount of scans in the DB for the specific project uuid """
        assert project_uuid is not None

        session = self.session_spawner.get_new_session()
        amount = session.query(ScanDatabase).filter(
            ScanDatabase.project_uuid == project_uuid
            ).count()

        self.session_spawner.destroy_session(session)

        return amount
