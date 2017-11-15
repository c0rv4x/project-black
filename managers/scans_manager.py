""" Class that keeps info on scans """
from black.black.db import Sessions, ProjectDatabase, ScanDatabase


class ScanManager(object):
    def __init__(self):
        self.scans = {}

        self.session_spawner = Sessions()

    def get_scans(self, project_uuid, ips):
        """ Selects all the scans from the db that are attached
        to ips """
        session = self.session_spawner.get_new_session()

        scans = {}

        for each_ip in ips:
            scans_db = session.query(ScanDatabase).filter(
                ScanDatabase.target == each_ip,
                ScanDatabase.project_uuid == project_uuid
            ).distinct(ScanDatabase.target, ScanDatabase.port_number).all()

            scans[each_ip] = list(map(lambda each_scan: {
                "scan_id": each_scan.scan_id,
                "target": each_scan.target,
                "port_number": each_scan.port_number,
                "protocol": each_scan.protocol,
                "banner": each_scan.banner,
                "task_id": each_scan.task_id,
                "project_uuid": each_scan.project_uuid,
                "date_added": str(each_scan.date_added)
            }, scans_db))


        print(scans)
        return scans
