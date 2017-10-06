""" Keeps ScanManager, which is reponsible for working with Scan table """
from operator import itemgetter

from black.black.db import Sessions, Project, Scan


class ScanManager(object):
    """ ScanManager keeps track of all scans in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.scans = {}
        self.sessions = Sessions()

        self.update_from_db()

    def get_scans(self, project_uuid):
        """ Returns the list of scans """
        self.update_from_db()

        return self.scans.get(project_uuid, [])

    def update_from_db(self):
        """ Extract all the scans from the DB """
        session = self.sessions.get_new_session()

        # Find all project_uuids
        project_uuids = session.query(Project.project_uuid).all()

        for each_project_uuid_tupled in project_uuids:
            # For each project_uuid create an empty object in self.scans
            each_project_uuid = each_project_uuid_tupled[0]
            self.scans[each_project_uuid] = {}

            scans_found = session.query(Scan).filter(
                Scan.project_uuid == each_project_uuid
            ).distinct(Scan.target, Scan.port_number).all()
            scans = list(map(lambda x: {
                "scan_id": x.scan_id,
                "target": x.target,
                "port_number": x.port_number,
                "protocol": x.protocol,
                "banner": x.banner,
                "task_id": x.task_id,
                "project_uuid": x.project_uuid,
                "date_added": str(x.date_added)
            }, scans_found))

            scans.sort(key=itemgetter("port_number"))

            self.scans[each_project_uuid] = scans

        self.sessions.destroy_session(session)
