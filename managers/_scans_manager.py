""" Keeps ScanManager, which is reponsible for working with Scan table """
import uuid
import datetime
from operator import itemgetter

from black.black.db import Sessions, ProjectDatabase, ScanDatabase


class ScanManager(object):
    """ ScanManager keeps track of all scans in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.scans = {}
        self.sessions = Sessions()

        self.inited = {}

    def get_scans(self, project_uuid, ips):
        """ Returns the list of scans """

        if not self.inited.get(project_uuid, False):
            self.update_from_db(project_uuid)
            self.inited[project_uuid] = True

        if self.scans.get(project_uuid, False) is False:
            self.scans[project_uuid] = {}

        scans_filtered = self.scans[project_uuid]

        return scans_filtered

    def update_from_db(self, project_uuid=None, new_ids=None):
        """ Extract all the scans from the DB """
        session = self.sessions.get_new_session()

        # Find all project_uuids
        project_uuids = session.query(ProjectDatabase.project_uuid).all()

        # If we wanted to update scans for specific project, now is the best
        # chance to track projects in which we are interested
        if project_uuid is not None:
            project_uuids = [(project_uuid,)]

        for each_project_uuid_tupled in project_uuids:
            # For each project_uuid we either create an empty object in self.scans
            # or merge the existing scans with the new one
            each_project_uuid = each_project_uuid_tupled[0]

            if new_ids:
                current_project_scans = self.scans[each_project_uuid]

                for each_id in new_ids:
                    target = session.query(ScanDatabase).filter(
                        ScanDatabase.scan_id == each_id
                    ).one()

                    new_scan = {
                        "scan_id": target.scan_id,
                        "target": target.target,
                        "port_number": target.port_number,
                        "protocol": target.protocol,
                        "banner": target.banner,
                        "task_id": target.task_id,
                        "project_uuid": target.project_uuid,
                        "date_added": str(target.date_added)
                    }

                    old_scans = current_project_scans.get(new_scan["target"], [])

                    # Iterate over all old scans trying to find your port
                    data_updated = False
                    for each_old_scan in old_scans:
                        if each_old_scan["port_number"] == new_scan["port_number"]:
                            each_old_scan = new_scan
                            data_updated = True
                            break

                    if not data_updated:
                        old_scans.append(new_scan)
            else:
                self.scans[each_project_uuid] = {}

                # Find all targets which have open ports
                targets = session.query(ScanDatabase.target).filter(
                    ScanDatabase.project_uuid == each_project_uuid
                ).distinct().all()

                for each_target in targets:
                    target = each_target[0]

                    scans_found = session.query(ScanDatabase).filter(
                        ScanDatabase.target == target,
                        ScanDatabase.project_uuid == each_project_uuid
                    ).distinct(ScanDatabase.target, ScanDatabase.port_number).all()
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

                    self.scans[each_project_uuid][target] = scans

        self.sessions.destroy_session(session)
