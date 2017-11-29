import uuid
import aiodns
import asyncio
from sqlalchemy import desc, or_
from sqlalchemy.orm import aliased, contains_eager

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

    def get_ips(self, filters, project_uuid, page_number, page_size):
        """ Returns ips that are associated with a given project.
        Not all ips are selected. Only those, that are within the
        described page """
        session = self.session_spawner.get_new_session()

        filters_divided = {
            'ips': [],
            'hosts': [],
            'ports': [],
            'banners': [],
            'protocols': []
        }

        for key in filters.keys():
            filter_value = filters[key]
            for each_filter_value in filter_value:
                if key == 'ip':
                    if '%' in each_filter_value:
                        filters_divided['ips'].append(IPDatabase.ip_address.like(each_filter_value))
                    else:
                        filters_divided['ips'].append(IPDatabase.ip_address == each_filter_value)
                elif key == 'host':
                    if '%' in each_filter_value:
                        filters_divided['hosts'].append(HostDatabase.hostname.like(each_filter_value))
                    else:
                        filters_divided['hosts'].append(HostDatabase.hostname == each_filter_value)
                elif key == 'port':
                    filters_divided['ports'].append(ScanDatabase.port_number == each_filter_value)
                elif key == 'banner':
                    if '%' in each_filter_value:
                        filters_divided['banners'].append(ScanDatabase.banner.like(each_filter_value))
                    else:
                        filters_divided['banners'].append(ScanDatabase.banner == each_filter_value)
                elif key == 'protocol':
                    if '%' in each_filter_value:
                        filters_divided['protocols'].append(ScanDatabase.protocol.like(each_filter_value))
                    else:
                        filters_divided['protocols'].append(ScanDatabase.protocol == each_filter_value)

        grouped_filters = []
        for subfilters in filters_divided.values():
            if subfilters:
                grouped_filters.append(or_(*subfilters))

        if grouped_filters:
            # Select only those ips that have suitable ports. Port are also filtered
            req_ips_from_db = session.query(IPDatabase).filter(
                IPDatabase.project_uuid == project_uuid
            ).join(IPDatabase.ports
            ).filter(*grouped_filters
            ).options(contains_eager(IPDatabase.ports))
        else:
            # Here we select ips and perform outer join with scans
            req_ips_from_db = session.query(IPDatabase).filter(
                IPDatabase.project_uuid == project_uuid
            ).join(IPDatabase.ports, isouter=True
            ).options(contains_eager(IPDatabase.ports))          

        ips_from_db = req_ips_from_db.offset(page_number * page_size).limit(page_size).all()

        self.session_spawner.destroy_session(session)

        # Reformat the ips to make the JSON-like objects
        ips = list(map(lambda each_ip: self.format_ip(each_ip), ips_from_db))

        # Together with ips, return amount of total ips in the database
        return {"total_db_ips": self.count_ips(project_uuid), "ips": ips}

    def format_ip(self, ip_object):
        """ Getting ip database object, returns the same object, but JSONed """
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
            }, ip_object.ports))
        }

    def find_ip_db(self, ip_address, project_uuid):
        """ Finds ip address in the database """
        session = self.session_spawner.get_new_session()
        ip_from_db = session.query(IPDatabase).filter(
            IPDatabase.project_uuid == project_uuid,
            IPDatabase.ip_address == ip_address
        ).one_or_none()
        self.session_spawner.destroy_session(session)

        return ip_from_db

    def find_hostname(self, hostname, project_uuid):
        """ Finds hostname in the database """
        session = self.session_spawner.get_new_session()
        host_from_db = session.query(HostDatabase).filter(
            HostDatabase.project_uuid == project_uuid,
            HostDatabase.hostname == hostname
        ).one_or_none()
        self.session_spawner.destroy_session(session)

        return host_from_db

    def get_one_ip(self, ip_address, project_uuid):
        """ Returns one nicely formatted ip address with scans """
        ip_from_db = self.find_ip_db(ip_address, project_uuid)

        if ip_from_db is None:
            return None

        return self.format_ip(ip_from_db)

    def get_hosts(self, filters, project_uuid, page_number, page_size):
        """ Returns hosts associated with a given project.
        Not all hosts are returned. Only those that are within
        the described page"""
        session = self.session_spawner.get_new_session()

        # Select all hosts from the db
        hosts_from_db = session.query(HostDatabase).filter(
            HostDatabase.project_uuid == project_uuid
        ).offset(page_number * page_size).limit(page_size).all()
        self.session_spawner.destroy_session(session)

        # Reformat each hosts to JSON-like objects
        hosts = list(map(lambda each_host: {
            "host_id": each_host.host_id,
            "hostname": each_host.hostname,
            "comment": each_host.comment,
            "ip_addresses": list(map(lambda each_ip: self.get_one_ip(each_ip.ip_address, project_uuid), each_host.ip_addresses))
        }, hosts_from_db))

        # Together with hosts list return total amount of hosts in the db
        return {
            "total_db_hosts": self.count_hosts(project_uuid),
            "hosts": hosts
        }

    def count_ips(self, project_uuid):
        """ Counts ip entries in the database (for single project) """
        assert project_uuid is not None

        if self.ips.get(project_uuid, None) is None:
            self.ips[project_uuid] = {}

        if self.ips[project_uuid].get("ips_count", None) is None:
            session = self.session_spawner.get_new_session()

            self.ips[project_uuid]["ips_count"
                                  ] = session.query(IPDatabase).filter(
                                      IPDatabase.project_uuid == project_uuid
                                  ).count()

            self.session_spawner.destroy_session(session)

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
            self.session_spawner.destroy_session(session)

        return self.hosts[project_uuid]["hosts_count"]

    def create_ip(self, ip_address, project_uuid):
        """ Creating an ip address we should first check whether it is already
        in the db, then create a new one if necessary """
        if self.find_ip_db(ip_address, project_uuid) is None:
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
                self.session_spawner.destroy_session(session)
            except Exception as exc:
                return {"status": "error", "text": str(exc)}
            else:
                ips_count = self.ips[project_uuid].get('ips_count', 0)
                ips_count += 1
                self.ips[project_uuid]["ips_count"] = ips_count

                return {
                    "status": "success",
                    "new_scope":
                        {
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

    def create_host(self, hostname, project_uuid):
        """ Creating a host we should first check whether it is already
        in the db, then create a new one if necessary """
        if self.find_hostname(hostname, project_uuid) is None:
            try:
                session = self.session_spawner.get_new_session()
                db_object = HostDatabase(
                    host_id=str(uuid.uuid4()),
                    hostname=hostname,
                    comment="",
                    project_uuid=project_uuid
                )
                session.add(db_object)
                session.commit()
                self.session_spawner.destroy_session(session)
            except Exception as exc:
                return {"status": "error", "text": str(exc)}
            else:
                hosts_count = self.hosts[project_uuid].get('hosts_count', 0)
                hosts_count += 1
                self.hosts[project_uuid]["hosts_count"] = hosts_count

                return {
                    "status": "success",
                    "new_scope":
                        {
                            "type": "host",
                            "host_id": db_object.host_id,
                            "hostname": hostname,
                            "ip_addresses": [],
                            "comment": "",
                            "project_uuid": project_uuid
                        }
                }

        return {"status": "duplicate"}

    def delete_scope(self, scope_id, scope_type):
        """ Deletes scope by its id """
        try:
            session = self.session_spawner.get_new_session()

            if scope_type == "ip_address":
                db_object = session.query(IPDatabase).filter(
                    IPDatabase.ip_id == scope_id
                ).one()
            else:
                db_object = session.query(HostDatabase).filter(
                    HostDatabase.host_id == scope_id
                ).one()

            project_uuid = db_object.project_uuid
            session.delete(db_object)
            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
        else:
            if scope_type == "ip_address":
                ips_count = self.ips[project_uuid].get('ips_count', 0)
                ips_count -= 1
                self.ips[project_uuid]['ips_count'] = ips_count
            else:
                hosts_count = self.hosts[project_uuid].get('hosts_count', 0)
                hosts_count -= 1
                self.hosts[project_uuid]['hosts_count'] = hosts_count
            return {"status": "success"}

    def update_scope(self, scope_id, comment, scope_type):
        """ Update a comment on the scope """
        try:
            session = self.session_spawner.get_new_session()
        
            if scope_type == "ip_address":
                db_object = session.query(IPDatabase).filter(
                    IPDatabase.ip_id == scope_id
                ).one()
            else:
                db_object = session.query(HostDatabase).filter(
                    HostDatabase.host_id == scope_id
                ).one()        

            db_object.comment = comment
            session.add(db_object)
            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as exc:
            return {"status": "error", "text": str(exc)}
        else:
            return {"status": "success"}


    async def resolve_scopes(self, scopes_ids, project_uuid):
        """ Using all the ids of scopes, resolve the hosts, now we
        resolve ALL the scopes, that are related to the project_uuid """
        session = self.session_spawner.get_new_session()

        # Select all hosts from the db
        project_hosts = session.query(HostDatabase).filter(
            HostDatabase.project_uuid == project_uuid
        ).all()

        if scopes_ids is None:
            to_resolve = project_hosts
        else:
            # This should not work for now, but TODO: make it actually work
            to_resolve = list(
                filter(lambda x: x.host_id in scopes_ids, project_hosts)
            )

        resolver = aiodns.DNSResolver(loop=asyncio.get_event_loop())
        futures = []

        for each_host in to_resolve:
            each_future = resolver.query(each_host.hostname, "A")
            each_future.database_host = each_host
            futures.append(each_future)

        (done_futures, _) = await asyncio.wait(
            futures, return_when=asyncio.ALL_COMPLETED
        )

        while done_futures:
            each_future = done_futures.pop()

            try:
                exc = each_future.exception()
                result = each_future.result()
                host = each_future.database_host
            except Exception:
                continue

            if exc:
                print("RESOLVE EXCEPTION", each_future, exc)

            for each_result in result:
                # Well, this is strange, but ip in aiodns is returned in 'host'
                # field
                resolved_ip = each_result.host
                found_ip = self.find_ip_db(resolved_ip, project_uuid)

                if found_ip:
                    found = False
                    for each_inner_ip_address in host.ip_addresses:
                        if each_inner_ip_address.ip_id == found_ip.ip_id:
                            found = True

                    if not found:
                        host.ip_addresses.append(found_ip)
                        found_ip.hostnames.append(host)
                        session.add(host)
                        session.add(found_ip)
                else:
                    ip_create_result = self.create_ip(
                        resolved_ip, project_uuid
                    )

                    if ip_create_result["status"] == "success":
                        newly_created_ip = ip_create_result["new_scope"]

                        host.ip_addresses.append(newly_created_ip)
                        newly_created_ip.hostnames.append(host)
                        session.add(host)
                        session.add(newly_created_ip)
        session.commit()
        self.session_spawner.destroy_session(session)
        