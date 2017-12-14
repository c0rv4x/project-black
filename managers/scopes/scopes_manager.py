import uuid
import aiodns
import asyncio
from sqlalchemy import desc, or_
from sqlalchemy.orm import aliased, joinedload, subqueryload, contains_eager

from black.black.db import Sessions, IPDatabase, ProjectDatabase, HostDatabase, ScanDatabase


import cProfile
from io import StringIO
import pstats
import contextlib

@contextlib.contextmanager
def profiled():
    pr = cProfile.Profile()
    pr.enable()
    yield
    pr.disable()
    s = StringIO()
    ps = pstats.Stats(pr, stream=s).sort_stats('cumulative')
    ps.print_stats()
    # uncomment this to see who's calling what
    ps.print_callers()
    print(s.getvalue())

class ScopeManager(object):
    """ ScopeManager keeps track of all ips and hosts in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        # A little cache for ip metainfo
        self.ips = {}

        # A little cache for host metainfo
        self.hosts = {}

        self.session_spawner = Sessions()

    def parse_filters(self, filters):
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
                    filters_divided['ports'].append(each_filter_value)
                elif key == 'banner':
                    filters_divided['banners'].append(each_filter_value)
                elif key == 'protocol':
                    filters_divided['protocols'].append(each_filter_value)

        return filters_divided

    def get_ips(self, filters, project_uuid, page_number, page_size):
        """ Returns ips that are associated with a given project.
        Not all ips are selected. Only those, that are within the
        described page """
        session = self.session_spawner.get_new_session()

        # Parse filters into an object for more comfortable work
        filters_divided = self.parse_filters(filters)

        # Query all the scans and order them by date they were modified
        subq = session.query(ScanDatabase).filter(
            ScanDatabase.project_uuid == project_uuid
        ).order_by(desc(ScanDatabase.date_added)
        ).subquery('scans_ordered')
        alias_ordered = aliased(ScanDatabase, subq)
        ordered = session.query(alias_ordered)

        # Select distinc scans (we need only the latest)
        scans_from_db_raw = ordered.distinct(alias_ordered.target, alias_ordered.port_number)

        # Now we should filter all the data using client's filters
        filters_exist = filters_divided['ports'] or filters_divided['protocols'] or filters_divided['banners']
        chained_filters = []

        # If there are no filters, no need to chain empty lists
        if filters_exist:
            ports_filters_list = map(lambda port_number: alias_ordered.port_number == port_number, filters_divided['ports'])
            ports_filters = or_(*ports_filters_list)

            protocols_filters_list = []
            for protocol in filters_divided['protocols']:
                if '%' in protocol:
                    protocols_filters_list.append(alias_ordered.protocol.ilike(protocol))
                else:
                    protocols_filters_list.append(alias_ordered.protocol == protocol)
            protocols_filters = or_(*protocols_filters_list)

            banners_filters_list = []
            for banner in filters_divided['banners']:
                if '%' in banner:
                    banners_filters_list.append(alias_ordered.banner.ilike(banner))
                else:
                    banners_filters_list.append(alias_ordered.banner == banner)
            banners_filters = or_(*banners_filters_list)

            chained_filters = [ports_filters, protocols_filters, banners_filters]

        # Filter ports to correspond the request
        scans_from_db = scans_from_db_raw.filter(*chained_filters).subquery('scans_distinct')

        # Now select ips, outer joining them with scans
        ips_query = session.query(IPDatabase
            ).filter(
                IPDatabase.project_uuid == project_uuid,
                *filters_divided['ips']
            ).from_self(
            ).join(scans_from_db, IPDatabase.ports, isouter=(not filters_exist)
            ).options(contains_eager(IPDatabase.ports, alias=scans_from_db)
            )

        ips_query_subq = aliased(IPDatabase, ips_query.subquery('all_ips_parsed'))

        ids_limited = ips_query.from_self(IPDatabase.ip_id).distinct(
            ).limit(page_size
            ).offset(page_size * page_number
            ).subquery('limited_ips_ids')

        ips_from_db = session.query(ips_query_subq
            ).filter(ips_query_subq.ip_id.in_(ids_limited)
            ).join(scans_from_db, ips_query_subq.ports, isouter=(not filters_exist)
            ).options(contains_eager(ips_query_subq.ports, alias=scans_from_db)
            ).all()

        selected_ips = ips_query.count()

        self.session_spawner.destroy_session(session)

        # Reformat the ips to make the JSON-like objects
        ips = list(map(lambda each_ip: self.format_ip(each_ip), ips_from_db))

        # Together with ips, return amount of total ips in the database
        return {"total_db_ips": self.count_ips(project_uuid), "selected_ips": selected_ips, "ips": ips}

    def format_ip(self, ip_object, no_hosts=False):
        """ Getting ip database object, returns the same object, but JSONed """
        return {
            "ip_id": ip_object.ip_id,
            "ip_address": ip_object.ip_address,
            "comment": ip_object.comment,
            "project_uuid": ip_object.project_uuid,
            "hostnames": [] if no_hosts else list(map(lambda host: host.hostname, ip_object.hostnames)),
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
        # Parse filters into an object for more comfortable work
        filters_divided = self.parse_filters(filters)

        session = self.session_spawner.get_new_session()

        # Query all the scans and order them by date they were modified
        subq = session.query(ScanDatabase).filter(
            ScanDatabase.project_uuid == project_uuid
        ).order_by(desc(ScanDatabase.date_added)
        ).subquery('scans_ordered')
        alias_ordered = aliased(ScanDatabase, subq)
        ordered = session.query(alias_ordered)

        # Select distinc scans (we need only the latest)
        scans_from_db_raw = ordered.distinct(alias_ordered.target, alias_ordered.port_number)

        # Now we should filter all the data using client's filters
        scan_filters_exist = filters_divided['ports'] or filters_divided['protocols'] or filters_divided['banners']
        ip_filters_exist = filters_divided['ips'] or False
        chained_filters = []

        # If there are no filters, no need to chain empty lists
        if scan_filters_exist:
            ports_filters_list = map(lambda port_number: alias_ordered.port_number == port_number, filters_divided['ports'])
            ports_filters = or_(*ports_filters_list)

            protocols_filters_list = []
            for protocol in filters_divided['protocols']:
                if '%' in protocol:
                    protocols_filters_list.append(alias_ordered.protocol.ilike(protocol))
                else:
                    protocols_filters_list.append(alias_ordered.protocol == protocol)
            protocols_filters = or_(*protocols_filters_list)

            banners_filters_list = []
            for banner in filters_divided['banners']:
                if '%' in banner:
                    banners_filters_list.append(alias_ordered.banner.ilike(banner))
                else:
                    banners_filters_list.append(alias_ordered.banner == banner)
            banners_filters = or_(*banners_filters_list)

            chained_filters = [ports_filters, protocols_filters, banners_filters]

        # Filter ports to correspond the request
        scans_from_db = scans_from_db_raw.filter(*chained_filters).subquery('scans_distinct')

        # Now select ips, outer joining them with scans
        ips = session.query(IPDatabase).filter(
            IPDatabase.project_uuid == project_uuid,
            *filters_divided['ips']
        ).subquery('ips_formatted')

        # Now select ips, outer joining them with scans
        hosts_from_db = session.query(HostDatabase
            ).filter(
                HostDatabase.project_uuid == project_uuid,
                *filters_divided['hosts']
            ).limit(page_size
            ).offset(page_number * page_size
            ).from_self(
            ).join(ips, HostDatabase.ip_addresses, isouter=(not ip_filters_exist and not ip_filters_exist)
            ).join(scans_from_db, IPDatabase.ports, isouter=(not scan_filters_exist)
            ).options(contains_eager(HostDatabase.ip_addresses, alias=ips).contains_eager(IPDatabase.ports, alias=scans_from_db)
            ).all()

        # Now select ips, outer joining them with scans
        selected_hosts = session.query(HostDatabase
            ).filter(
                HostDatabase.project_uuid == project_uuid,
                *filters_divided['hosts']
            ).from_self(
            ).join(ips, HostDatabase.ip_addresses, isouter=(not ip_filters_exist and not ip_filters_exist)
            ).join(scans_from_db, IPDatabase.ports, isouter=(not scan_filters_exist)
            ).options(contains_eager(HostDatabase.ip_addresses, alias=ips).contains_eager(IPDatabase.ports, alias=scans_from_db)
            ).count()

        self.session_spawner.destroy_session(session)

        # Reformat each hosts to JSON-like objects
        hosts = list(map(lambda each_host: {
            "host_id": each_host.host_id,
            "hostname": each_host.hostname,
            "comment": each_host.comment,
            "ip_addresses": list(map(lambda each_ip: self.format_ip(each_ip, no_hosts=True), each_host.ip_addresses))
        }, hosts_from_db))

        # Together with hosts list return total amount of hosts in the db
        return {
            "total_db_hosts": self.count_hosts(project_uuid),
            "selected_hosts": selected_hosts,
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
                db_object = IPDatabase(
                    ip_id=str(uuid.uuid4()),
                    ip_address=ip_address,
                    comment="",
                    project_uuid=project_uuid
                )

                session = self.session_spawner.get_new_session()
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

    def create_batch_ips(self, ips, project_uuid):
        results = {
            "status": "success",
            "new_scopes": []
        }

        to_add = []

        for ip_address in ips:
            if self.find_ip_db(ip_address, project_uuid) is None:
                to_add.append(ip_address)

        try:
            current_date = datetime.datetime.utcnow()
            self.session_spawner.engine.execute(
                IPDatabase.__table__.insert(),
                [{"ip_id": str(uuid.uuid4()), "ip_address": ip_address, "comment": "",
                "project_uuid": project_uuid, "task_id": None, "date_added": current_date
                } for ip_address in to_add]
            )

            ips_count = self.ips[project_uuid].get('ips_count', 0)
            ips_count += len(to_add)
            self.ips[project_uuid]["ips_count"] = ips_count            
            # session = self.session_spawner.get_new_session()
            # session.add_all(results["new_scopes"])
            # session.commit()
            # self.session_spawner.destroy_session(session)
        except Exception as exc:
            return {"status": "error", "text": str(exc)}

        return results


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
        