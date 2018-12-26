from black.db import Sessions, FileDatabase


class FileManager(object):
    """ FileManager keeps track of all files in the system,
    exposing some interfaces for public use. """
    def __init__(self):
        self.sessions = Sessions()

    def count(self, project_uuid=None):
        return FileDatabase.count(project_uuid)

    def get_stats_ips(self, project_uuid, ip_ids, filters):
        return FileDatabase.get_stats_for_ips(project_uuid, ip_ids, filters)

    def get_stats_hosts(self, project_uuid, host_ids, filters):
        return FileDatabase.get_stats_for_hosts(project_uuid, host_ids, filters)

    def get_files_ips(self, ip, port_number, limit, offset, filters):
        return FileDatabase.get_files_ip(ip, port_number, limit, offset, filters)

    def get_files_hosts(self, host_id, port_number, limit, offset, filters):
        return FileDatabase.get_files_host(host_id, port_number, limit, offset, filters)
