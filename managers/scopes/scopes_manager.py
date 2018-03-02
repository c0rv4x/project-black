import uuid
import aiodns
import asyncio
from sqlalchemy.orm import aliased, joinedload, contains_eager

from black.black.db import (Sessions, IPDatabase, ProjectDatabase,
                            HostDatabase, ScanDatabase, FileDatabase)
from managers.scopes.filters import Filters
from managers.scopes.subquery_builder import SubqueryBuilder


class ScopeManager(object):
    """ ScopeManager keeps track of all ips and hosts in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        # A little cache for ip metainfo
        self.ips = {}

        # A little cache for host metainfo
        self.hosts = {}

        self.session_spawner = Sessions()

    def get_hosts(
        self, filters,  project_uuid,
        page_number=None, page_size=None, hosts_only=False
    ):
        """ Returns hosts associated with a given project.
        Not all hosts are returned. Only those that are within
        the described page"""

        import time
        t = time.time()

        session = self.session_spawner.get_new_session()

        # Parse filters into an object for more comfortable work
        parsed_filters = Filters.parse_filters(filters)

        # Create scans subquery

        scans_filters_exist = len(parsed_filters['ports']) != 0

        scans_from_db = SubqueryBuilder.build_scans_subquery(
            session, project_uuid, parsed_filters)

        # Create IPS subquery

        ip_filters_exist = len(parsed_filters['ips']) != 0

        ips_query = (
            session.query(
                IPDatabase
            )
            .filter(
                IPDatabase.project_uuid == project_uuid,
                *parsed_filters['ips']
            )
        )

        ips_query_subq = aliased(
            IPDatabase, ips_query.subquery('all_ips_parsed'))

        # Create files subquery

        files_filters_exist = len(parsed_filters['files']) != 0

        files_query_aliased = SubqueryBuilder.build_files_subquery(
            session, project_uuid, parsed_filters)

        # Create hosts subquery

        hosts_query = (
            session.query(
                HostDatabase
            )
            .filter(
                HostDatabase.project_uuid == project_uuid,
                *parsed_filters['hosts']
            )
            .join(
                ips_query_subq, HostDatabase.ip_addresses,
                isouter=(not ip_filters_exist)
            )
            .join(
                scans_from_db, IPDatabase.ports,
                isouter=(not scans_filters_exist)
            )
            .join(
                files_query_aliased, HostDatabase.files,
                isouter=(not files_filters_exist)
            )
        )

        # Perform pagination
        if page_number is None or page_size is None:
            hosts_limited = (
                hosts_query
                .from_self(HostDatabase.id, HostDatabase.target)
                .distinct()
                .order_by(HostDatabase.target)
                .from_self(HostDatabase.id)
                .subquery('limited_hosts_ids')
            )
        else:
            hosts_limited = (
                hosts_query
                .from_self(HostDatabase.id, HostDatabase.target)
                .distinct()
                .order_by(HostDatabase.target)
                .limit(page_size)
                .offset(page_size * page_number)
                .from_self(HostDatabase.id)
                .subquery('limited_hosts_ids')
            )

        selected_hosts = (
            hosts_query
            .from_self(HostDatabase.id)
            .distinct()
            .count()
        )

        # Now select hosts, joining them with
        # all other subqueries from the prev step
        hosts_from_db = (
            session.query(HostDatabase)
            .filter(
                HostDatabase.project_uuid == project_uuid,
                HostDatabase.id.in_(hosts_limited),
                *parsed_filters['hosts']
            )
            .join(
                ips_query_subq, HostDatabase.ip_addresses,
                isouter=(not ip_filters_exist)
            )
            .join(
                scans_from_db, IPDatabase.ports,
                isouter=(not scans_filters_exist)
            )
            .join(
                files_query_aliased, HostDatabase.files,
                isouter=(not files_filters_exist)
            )
            .options(
                contains_eager(HostDatabase.ip_addresses, alias=ips_query_subq)
                .contains_eager(IPDatabase.ports, alias=scans_from_db),
                contains_eager(HostDatabase.files, alias=files_query_aliased))
            .order_by(HostDatabase.target)
            .all()
        )

        self.session_spawner.destroy_session(session)

        # Reformat each hosts to JSON-like objects
        hosts = list(map(lambda each_host: {
            "host_id": each_host.id,
            "hostname": each_host.target,
            "comment": each_host.comment,
            "ip_addresses": list(
                                map(
                                    lambda each_ip: self.format_ip(
                                        each_ip, no_hosts=True, no_files=True),
                                    each_host.ip_addresses
                                )
                            ),
            "files": list(map(lambda each_file: {
                "file_id": each_file.file_id,
                "file_name": each_file.file_name,
                "port_number": each_file.port_number,
                "file_path": each_file.file_path,
                "status_code": each_file.status_code,
                "content_length": each_file.content_length,
                "task_id": each_file.task_id,
                "date_added": str(each_file.date_added)
            }, each_host.files))
        }, hosts_from_db))

        print("@@@@ Hosts selected in:", time.time() - t)

        # Together with hosts list return total amount of hosts in the db
        return {
            "total_db_hosts": self.count_hosts(project_uuid),
            "selected_hosts": selected_hosts,
            "hosts": hosts
        }

    def get_ips(
        self, filters, project_uuid,
        page_number=None, page_size=None, ips_only=False
    ):
        """ Returns ips that are associated with a given project.
        Not all ips are selected. Only those, that are within the
        described page """
        session = self.session_spawner.get_new_session()

        # Parse filters into an object for more comfortable work
        parsed_filters = Filters.parse_filters(filters)

        # SCANS

        scans_filters_exist = len(parsed_filters['ports']) != 0
        scans_from_db = SubqueryBuilder.build_scans_subquery(
            session, project_uuid, parsed_filters)

        # /SCANS
        files_filters = parsed_filters['files']
        files_filters_exist = len(files_filters) != 0
        files_query = (
            session.query(
                FileDatabase
            )
            .filter(FileDatabase.project_uuid == project_uuid)
        )
        files_query_aliased = aliased(
            FileDatabase, files_query.subquery('files_filtered'))

        # Now select ips, outer joining them with scans
        ips_query = (
            session.query(IPDatabase)
            .filter(
                IPDatabase.project_uuid == project_uuid,
                *parsed_filters['ips']
            )
            .from_self()
            .join(
                scans_from_db, IPDatabase.ports,
                isouter=(not scans_filters_exist)
            )
            .join(
                files_query_aliased, IPDatabase.files,
                isouter=(not files_filters_exist)
            )
        )

        ips_query_subq = aliased(
            IPDatabase, ips_query.subquery('all_ips_parsed'))

        # From the filtered ips, we need to select only first N of them.
        # So we select ids of the first N. Then select all the ips, which have
        # that ids.
        if page_size is None or page_number is None:
            ids_limited = (
                ips_query.from_self(IPDatabase.id, IPDatabase.target)
                .distinct()
                .order_by(IPDatabase.target)
                .from_self(IPDatabase.id)
                .subquery('limited_ips_ids')
            )
        else:
            ids_limited = (
                ips_query.from_self(IPDatabase.id, IPDatabase.target)
                .distinct()
                .order_by(IPDatabase.target)
                .limit(page_size)
                .offset(page_size * page_number)
                .from_self(IPDatabase.id)
                .subquery('limited_ips_ids')
            )

        if ips_only:
            ips_from_db = (
                session.query(
                    ips_query_subq.target
                )
                .filter(ips_query_subq.id.in_(ids_limited))
                .all()
            )
        else:
            ips_from_db = (
                session.query(
                    IPDatabase
                )
                .filter(
                    IPDatabase.project_uuid == project_uuid,
                    IPDatabase.id.in_(ids_limited),
                    *parsed_filters['ips']
                )
                .join(
                    scans_from_db, IPDatabase.ports,
                    isouter=(not scans_filters_exist)
                )
                .join(
                    files_query_aliased, IPDatabase.files,
                    isouter=(not files_filters_exist)
                )
                .options(
                    joinedload(IPDatabase.hostnames),
                    contains_eager(
                        IPDatabase.files, alias=files_query_aliased
                    ),
                    contains_eager(
                        IPDatabase.ports, alias=scans_from_db)
                    )
                .all()
            )

        selected_ips = ips_query.from_self(IPDatabase.id).distinct().count()

        self.session_spawner.destroy_session(session)

        if ips_only:
            ips = list(map(lambda each_ip: each_ip[0], ips_from_db))
        else:
            # Reformat the ips to make the JSON-like objects
            ips = list(
                map(
                    lambda each_ip: self.format_ip(each_ip),
                    ips_from_db
                )
            )

        # Together with ips, return amount of total ips in the database
        return {
            "total_db_ips": self.count_ips(project_uuid),
            "selected_ips": selected_ips,
            "ips": ips
        }

    def format_ip(
        self, ip_object,
        no_hosts=False, no_ports=False, no_files=False
    ):
        """ Getting ip database object, returns the same object, but JSONed """
        if no_hosts:
            hostnames = []
        else:
            hostnames = list(map(
                lambda host: host.target, ip_object.hostnames
            ))

        return {
            "ip_id": ip_object.id,
            "ip_address": ip_object.target,
            "comment": ip_object.comment,
            "project_uuid": ip_object.project_uuid,
            "hostnames": hostnames,
            "scans": [] if no_ports else list(map(lambda each_scan: {
                "scan_id": each_scan.scan_id,
                "target": each_scan.target,
                "port_number": each_scan.port_number,
                "protocol": each_scan.protocol,
                "banner": each_scan.banner,
                "task_id": each_scan.task_id,
                "project_uuid": each_scan.project_uuid,
                "date_added": str(each_scan.date_added)
            }, ip_object.ports)),
            "files": [] if no_files else list(map(lambda each_file: {
                "file_id": each_file.file_id,
                "file_name": each_file.file_name,
                "port_number": each_file.port_number,
                "file_path": each_file.file_path,
                "status_code": each_file.status_code,
                "content_length": each_file.content_length,
                "task_id": each_file.task_id,
                "date_added": str(each_file.date_added)
            }, ip_object.files))
        }

    def find_ip_db(self, ip_address, project_uuid):
        """ Finds ip address in the database """

        session = self.session_spawner.get_new_session()
        ip_from_db = session.query(IPDatabase).filter(
            IPDatabase.project_uuid == project_uuid,
            IPDatabase.target == ip_address
        ).one_or_none()
        self.session_spawner.destroy_session(session)

        return ip_from_db

    def find_hostname(self, hostname, project_uuid):
        """ Finds hostname in the database """

        session = self.session_spawner.get_new_session()
        host_from_db = session.query(HostDatabase).filter(
            HostDatabase.project_uuid == project_uuid,
            HostDatabase.target == hostname
        ).one_or_none()
        self.session_spawner.destroy_session(session)

        return host_from_db

    def get_one_ip(self, ip_address, project_uuid):
        """ Returns one nicely formatted ip address with scans """

        ip_from_db = self.find_ip_db(ip_address, project_uuid)

        if ip_from_db is None:
            return None

        return self.format_ip(ip_from_db)

    def count_ips(self, project_uuid):
        """ Counts ip entries in the database (for single project) """

        assert project_uuid is not None

        if self.ips.get(project_uuid, None) is None:
            self.ips[project_uuid] = {}

        if self.ips[project_uuid].get("ips_count", None) is None:
            session = self.session_spawner.get_new_session()

            self.ips[project_uuid]["ips_count"] = (
                session.query(IPDatabase).filter(
                    IPDatabase.project_uuid == project_uuid
                ).count()
            )

            self.session_spawner.destroy_session(session)

        return self.ips[project_uuid]["ips_count"]

    def count_hosts(self, project_uuid):
        """ Counts host entries in the database (for single project) """

        if self.hosts.get(project_uuid, None) is None:
            self.hosts[project_uuid] = {}

        if self.hosts[project_uuid].get("hosts_count", None) is None:
            session = self.session_spawner.get_new_session()

            self.hosts[project_uuid]["hosts_count"] = (
                session.query(HostDatabase).filter(
                    HostDatabase.project_uuid == project_uuid
                ).count()
            )
            self.session_spawner.destroy_session(session)

        return self.hosts[project_uuid]["hosts_count"]

    def create_ip(self, ip_address, project_uuid, format_ip=True):
        """ Creating an ip address we should first check whether it is already
        in the db, then create a new one if necessary """

        if self.find_ip_db(ip_address, project_uuid) is None:
            try:
                db_object = IPDatabase(
                    id=str(uuid.uuid4()),
                    target=ip_address,
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
                        self.format_ip(
                            db_object, no_hosts=True,
                            no_ports=True, no_files=True
                        ) if format_ip else db_object
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
                [
                    {
                        "id": str(uuid.uuid4()),
                        "target": ip_address,
                        "comment": "",
                        "project_uuid": project_uuid,
                        "task_id": None,
                        "date_added": current_date
                    } for ip_address in to_add
                ]
            )

            ips_count = self.ips[project_uuid].get('ips_count', 0)
            ips_count += len(to_add)
            self.ips[project_uuid]["ips_count"] = ips_count
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
                    id=str(uuid.uuid4()),
                    target=hostname,
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
                            "host_id": db_object.id,
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
                db_object = (
                    session.query(
                        IPDatabase
                    )
                    .filter(IPDatabase.id == scope_id)
                    .options(contains_eager(IPDatabase.hostnames))
                    .one()
                )
            else:
                db_object = (
                    session.query(
                        HostDatabase
                    )
                    .filter(HostDatabase.id == scope_id)
                    .options(contains_eager(HostDatabase.ip_addresses))
                    .one()
                )

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
                    IPDatabase.id == scope_id
                ).one()
            else:
                db_object = session.query(HostDatabase).filter(
                    HostDatabase.id == scope_id
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
        ).options(joinedload(HostDatabase.ip_addresses)).all()

        if scopes_ids is None:
            to_resolve = project_hosts
        else:
            # This should not work for now, but TODO: make it actually work
            to_resolve = list(
                filter(lambda x: x.id in scopes_ids, project_hosts)
            )

        resolver = aiodns.DNSResolver(loop=asyncio.get_event_loop())
        futures = []

        for each_host in to_resolve:
            each_future = resolver.query(each_host.target, "A")
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
                        if each_inner_ip_address.id == found_ip.id:
                            found = True

                    if not found:
                        host.ip_addresses.append(session.merge(found_ip))
                        session.add(host)
                else:
                    ip_create_result = self.create_ip(
                        resolved_ip, project_uuid, format_ip=False
                    )

                    if ip_create_result["status"] == "success":
                        newly_created_ip = ip_create_result["new_scope"]

                        host.ip_addresses.append(newly_created_ip)
                        session.add(host)
        session.commit()
        self.session_spawner.destroy_session(session)
