import uuid
from sqlalchemy.orm import aliased
from sqlalchemy import desc

from black.black.db import Sessions, IPDatabase, ProjectDatabase, HostDatabase, ScanDatabase


class ScopeManager(object):
    """ ScopeManager keeps track of all ips and hosts in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        # A little cache for ip metainfo
        self.ips = {}

        # A little cache for host metainfo
        self.hosts = {}

        self.session_spawner = Sessions()

    def get_ips(self, project_uuid, page_number, page_size):
        """ Returns ips that are associated with a given project.
        Not all ips are selected. Only those, that are within the
        described page """
        session = self.session_spawner.get_new_session()

        # Select all ips from db
        ips_from_db = session.query(IPDatabase).filter(
            IPDatabase.project_uuid == project_uuid
        ).offset(page_number * page_size).limit(page_size).all()

        # Reformat the ips to make the JSON-like objects
        ips = list(map(lambda each_ip: self.format_ip(each_ip), ips_from_db))

        # Together with ips, return amount of total ips in the database
        return {"total_db_ips": self.count_ips(project_uuid), "ips": ips}

    def format_ip(self, ip_object):
        """ Getting ip database object, returns the same object, but with scans attached """
        session = self.session_spawner.get_new_session()

        subq = session.query(ScanDatabase).order_by(
            desc(ScanDatabase.date_added)
        ).subquery('scans')
        alias = aliased(ScanDatabase, subq)
        ordered = session.query(alias)
        scans_from_db = ordered.distinct(alias.target, alias.port_number)

        return {
            "ip_id": ip_object.ip_id,
            "ip_address": ip_object.ip_address,
            "comment": ip_object.comment,
            "project_uuid": ip_object.project_uuid,
            "hostnames": list(map(lambda host: host.hostname, ip_object.hostnames)),
            "scans": list(map(lambda each_scan: {
                "scan_id": each_scan.scan_id,
                "target": each_scan.target,
                "port_number": each_scan.port_number,
                "protocol": each_scan.protocol,
                "banner": each_scan.banner,
                "task_id": each_scan.task_id,
                "project_uuid": each_scan.project_uuid,
                "date_added": str(each_scan.date_added)
            }, scans_from_db))
        }

    def find_ip_address(self, ip_address, project_uuid):
        """ Finds ip address in the database """
        session = self.session_spawner.get_new_session()
        ip_from_db = session.query(IPDatabase).filter(
            IPDatabase.project_uuid == project_uuid,
            IPDatabase.ip_address == ip_address
        ).one_or_none()

        return ip_from_db

    def get_one_ip(self, ip_address, project_uuid):
        """ Returns one nicely formatted ip address with scans """
        ip_from_db = self.find_ip_address(ip_address, project_uuid)

        if ip_from_db is None:
            return None

        return self.format_ip(ip_from_db)

    def get_hosts(self, project_uuid, page_number, page_size):
        """ Returns hosts associated with a given project.
        Not all hosts are returned. Only those that are within
        the described page"""
        session = self.session_spawner.get_new_session()

        # Select all hosts from the db
        hosts_from_db = session.query(HostDatabase).filter(
            HostDatabase.project_uuid == project_uuid
        ).offset(page_number * page_size).limit(page_size).all()

        # Reformat each hosts to JSON-like objects
        hosts = list(map(lambda each_host: {
            "host_id": each_host.host_id,
            "hostname": each_host.hostname,
            "ip_addresses": list(map(lambda each_ip: self.get_one_ip(each_ip.ip_address, project_uuid), each_host.ip_addresses))
        }, hosts_from_db))

        # Together with hosts list return total amount of hosts in the db
        return {
            "total_db_hosts": self.count_hosts(project_uuid),
            "hosts": hosts
        }

    def count_ips(self, project_uuid):
        """ Counts ip entries in the database (for single project) """

        if self.ips.get(project_uuid, None) is None:
            self.ips[project_uuid] = {}

        if self.ips[project_uuid].get("ips_count", None) is None:
            session = self.session_spawner.get_new_session()

            self.ips[project_uuid]["ips_count"
                                  ] = session.query(IPDatabase).filter(
                                      IPDatabase.project_uuid == project_uuid
                                  ).count()

        return self.ips[project_uuid]["ips_count"]

    def count_hosts(self, project_uuid):
        """ Counts host entries in the database (for single project) """

        if self.hosts.get(project_uuid, None) is None:
            self.hosts[project_uuid] = {}

        if self.hosts[project_uuid].get("hosts_count", None) is None:
            session = self.session_spawner.get_new_session()

            self.hosts[project_uuid
                      ]["hosts_count"] = session.query(HostDatabase).filter(
                          HostDatabase.project_uuid == project_uuid
                      ).count()

        return self.hosts[project_uuid]["hosts_count"]

    def create_ip(self, ip_address, project_uuid):
        """ Creating an ip address we should first check whether it is already
        in the db, then create a new one if necessary """
        if self.find_ip_address(ip_address, project_uuid) is None:
            try:
                session = self.session_spawner.get_new_session()
                db_object = IPDatabase(
                    ip_id=str(uuid.uuid4()),
                    ip_address=ip_address,
                    comment="",
                    project_uuid=project_uuid
                )
                session.add(db_object)
                session.commit()
            except Exception as exc:
                return {
                    "status":"error",
                    "text": str(exc)
                }
            else:
                ips_count = self.ips[project_uuid].get('ips_count', 0)
                ips_count += 1
                self.ips[project_uuid]["ips_count"] = ips_count

                return {
                    "status": "success",
                    "new_scope": {
                        "type": "ip_address",
                        "ip_id": db_object.ip_id,
                        "ip_address": ip_address,
                        "hostnames": [],
                        "comment": "",
                        "project_uuid": project_uuid,
                        "scans": []
                    }
                }                

        return {"status": "duplicate"}
