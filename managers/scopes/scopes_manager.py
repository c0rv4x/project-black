from black.black.db import Sessions, IPDatabase, ProjectDatabase, HostDatabase


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
        ips = list(map(lambda each_ip: {
            "ip_id": each_ip.ip_id,
            "ip_address": each_ip.ip_address,
            "hostnames": list(map(lambda host: host.hostname, each_ip.hostnames))
        }, ips_from_db))

        # Together with ips, return amount of total ips in the database
        return {"total_db_ips": self.count_ips(project_uuid), "ips": ips}

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
            "ip_addresses": list(map(lambda each_ip: each_ip.ip_address, each_host.ip_addresses))
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
