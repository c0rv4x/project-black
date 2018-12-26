""" Class that keeps info on scans """
from black.db import Sessions, ProjectDatabase, ScanDatabase


class ScanManager(object):
    def __init__(self):
        self.session_spawner = Sessions()

    def count(self, project_uuid=None):
        """ Count amount of scans in the DB for the specific project uuid """
        with self.session_spawner.get_session() as session:
            amount = session.query(ScanDatabase).filter(
                ScanDatabase.project_uuid == project_uuid
            ).count()

        return amount
