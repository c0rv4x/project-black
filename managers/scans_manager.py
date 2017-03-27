""" Keeps ScanManager, which is reponsible for working with Scan table """
from operator import itemgetter

from black.black.db import sessions, Scan


class ScanManager(object):
    """ ScanManager keeps track of all scans in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.scans = []
        self.update_from_db()

    def get_scans(self):
        """ Returns the list of scans """
        self.update_from_db()

        return self.scans

    def update_from_db(self):
        """ Extract all the scans from the DB """
        self.scans = []
        session = sessions.get_new_session()
        scans_db = session.query(Scan).all()
        scans = list(map(lambda x: {
            "scan_id": x.scan_id,
            "target": x.target,
            "port_number": x.port_number,
            "protocol": x.protocol,
            "banner": x.banner,
            "task_id": x.task_id,
            "project_uuid": x.project_uuid,
            "date_added": str(x.date_added)
            }, scans_db))
        scans.sort(key=itemgetter("date_added"), reverse=True)

        unique_pairs = set()
        for scan in scans:
            pair = (scan["target"], scan["port_number"])

            if pair not in unique_pairs:
                unique_pairs.add(pair)
                self.scans.append(scan)

        sessions.destroy_session(session)
