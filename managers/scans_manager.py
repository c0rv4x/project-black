import uuid

from black.black.db import sessions, Scan


class ScanManager(object):
    """ ScanManager keeps track of all scans in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.scans = []
        self.update_from_db()

    def get_scans(self):
        """ Returns the list of scans """
        return self.scans

    def update_from_db(self):
        """ Extract all the scans from the DB """
        session = sessions.get_new_session()
        scans_db = session.query(Scan).all()
        self.scans = list(map(lambda x: {
                "scan_id": x.scan_id,
                "target": x.target,
                "port_number": x.port_number,
                "protocol": x.protocol,
                "banner": x.banner,
                "screenshot_path": x.screenshot_path,
                "tasks_ids": x.tasks_ids,
                "project_uuid": x.project_uuid
            }, 
            scans_db))
        sessions.destroy_session(session)        
