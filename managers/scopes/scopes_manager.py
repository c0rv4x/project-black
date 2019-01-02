import uuid
import time
import aiodns
import pprint
import asyncio
import datetime
from sqlalchemy import or_
from sqlalchemy.orm import aliased, joinedload, contains_eager

from black.db import (Sessions, IPDatabase, ProjectDatabase,
                        HostDatabase, ScanDatabase, FileDatabase,
                        TaskDatabase)
from managers.scopes.filters import Filters
from managers.scopes.subquery_builder import SubqueryBuilder

from common.logger import log
from .utils import get_nameservers


@log
class ScopeManager(object):
    """ ScopeManager keeps track of all ips and hosts in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.session_spawner = Sessions()
        self.debug_resolve_results = {}
        self.resolver_called = 0

    def get_hosts_with_ports(
        self, filters_raw,  project_uuid,
        page_number=None, page_size=None
    ):
        """ Returns hosts associated with a given project.
        Not all hosts are returned. Only those that are within
        the described page.
        The hosts are filtered by host/ip/scans/files properties.
        IPs and scans are included in the result, but not files"""
        # TODO: this method should not extract files, we need files
        # solely to make sure we imply the correct filtering mechanism
        # when `files` filter is used

        t = time.time()

        with self.session_spawner.get_session() as session:
            # Parse filters into an object for more comfortable work
            filters = Filters(filters_raw)

            scans_from_db = SubqueryBuilder.scans_basic_filtered(
                session, project_uuid, filters_raw)

            ips_query = SubqueryBuilder.ips_basic_filtered(
                session, project_uuid, filters.ips)

            ips_query_subq = aliased(
                IPDatabase, ips_query.subquery('all_ips_parsed'))

            files_query_aliased = SubqueryBuilder.files_basic_filtered(
                session, project_uuid, filters_raw)

            # Create hosts subquery
            ip_filters_exist = filters_raw.get('ip', False)
            scans_filters_exist = (
                filters_raw.get('port', False) or
                filters_raw.get('protocol', False) or
                filters_raw.get('banner', False)
            )
            files_filters_exist = filters_raw.get('files', False)

            hosts_query = (
                session.query(
                    HostDatabase
                )
                .filter(
                    HostDatabase.project_uuid == project_uuid,
                    filters.hosts
                )
                .join(
                    ips_query_subq, HostDatabase.ip_addresses,
                    isouter=(not ip_filters_exist)
                )
                .join(
                    scans_from_db, IPDatabase.ports,
                    isouter=(not scans_filters_exist)
                )
            )

            if files_filters_exist:
                hosts_query = (
                    hosts_query
                    .join(
                        files_query_aliased, HostDatabase.files,
                        isouter=False
                    )
                ) 

            hosts_ids = SubqueryBuilder.page_ids(
                hosts_query, HostDatabase, page_number, page_size)

            selected_hosts = (
                hosts_query
                .from_self(HostDatabase.id)
                .distinct()
                .count()
            )

            # Now select hosts, joining them with
            # all other subqueries from the prev step
            hosts_ips_scans_query = (
                session.query(HostDatabase)
                .filter(
                    HostDatabase.project_uuid == project_uuid,
                    HostDatabase.id.in_(hosts_ids),
                    filters.hosts
                )
                .join(
                    ips_query_subq, HostDatabase.ip_addresses,
                    isouter=(not ip_filters_exist)
                )
                .join(
                    scans_from_db, IPDatabase.ports,
                    isouter=(not scans_filters_exist)
                )
            )

            if files_filters_exist:
                hosts_from_db = (
                    hosts_ips_scans_query
                    .join(
                        files_query_aliased, HostDatabase.files,
                        isouter=False
                    )
                    .options(
                        contains_eager(HostDatabase.ip_addresses, alias=ips_query_subq)
                        .contains_eager(IPDatabase.ports, alias=scans_from_db),
                        contains_eager(HostDatabase.files, alias=files_query_aliased))
                    .all()
                )
            else:
                hosts_from_db = (
                    hosts_ips_scans_query
                    .options(
                        contains_eager(HostDatabase.ip_addresses, alias=ips_query_subq)
                        .contains_eager(IPDatabase.ports, alias=scans_from_db))
                    .all()                    
                )

        # Reformat each hosts to JSON-like objects
        hosts = (
            sorted(
                map(
                    lambda each_host: each_host.dict(
                        include_ips=True,
                        include_ports=True
                    ), hosts_from_db),
                key=lambda x: x['hostname']
            )
        )

        total_db_hosts = self.count_hosts(project_uuid)
    
        self.logger.info(
            "Selecting hosts: from {} hosts, filter: {}. Finished in {}. @{}".format(
                total_db_hosts,
                filters_raw,
                time.time() - t,
                format(project_uuid)
            )
        )

        # Together with hosts list return total amount of hosts in the db
        return {
            "total_db_hosts": total_db_hosts,
            "selected_hosts": selected_hosts,
            "hosts": hosts
        }

    def get_ips(self, filters, project_uuid):
        """ Select all ips which are relative to the project
        specified by project_uuid and which are passing the filters """
        t = time.time()

        with self.session_spawner.get_session() as session:
            # Parse filters into an object for more comfortable work
            parsed_filters = Filters(filters)

            # Scans
            scans_filters_exist = (
                filters.get('port', False) or
                filters.get('protocol', False) or
                filters.get('banner', False)
            )
            scans_from_db = SubqueryBuilder.scans_basic_filtered(
                session, project_uuid, filters)

            # Files
            files_filters_exist = filters.get('files', False)
            files_query_aliased = SubqueryBuilder.files_basic_filtered(
                session, project_uuid, filters)

            # Select IPs + Scans which passed the filters
            ips_query = (
                session.query(IPDatabase.target)
                .filter(
                    IPDatabase.project_uuid == project_uuid,
                    parsed_filters.ips
                )
            )

            if scans_filters_exist:
                ips_query = (
                    ips_query
                    .join(
                        scans_from_db, IPDatabase.ports,
                        isouter=False
                    )
                )

            if files_filters_exist:
                ips_query = (
                    ips_query
                    .join(
                        files_query_aliased, IPDatabase.files,
                        isouter=False
                    )                    
                )

            ips_from_db = (
                ips_query
                .distinct()
                .all()
            )

        self.logger.info(
            "Selecting ips only: filter: {}. Finished in {}. @{}".format(
                filters,
                time.time() - t,
                project_uuid
            )
        )

        return list(map(lambda x: x[0], ips_from_db))

    def get_ips_with_ports(
        self, filters, project_uuid,
        page_number=None, page_size=None
    ):
        """ Returns ips that are associated with a given project.
        Not all ips are selected. Only those, that are within the
        described page """
        t = time.time()

        with self.session_spawner.get_session() as session:
            # Parse filters into an object for more comfortable work
            parsed_filters = Filters(filters)

            # Scans
            scans_filters_exist = (
                filters.get('port', False) or
                filters.get('protocol', False) or
                filters.get('banner', False)
            )
            scans_from_db = SubqueryBuilder.scans_basic_filtered(
                session, project_uuid, filters)

            # Files
            files_filters_exist = filters.get('files', False)
            files_query_aliased = SubqueryBuilder.files_basic_filtered(
                session, project_uuid, filters)

            # Select IPs + Scans which passed the filters
            ips_query = (
                session.query(IPDatabase)
                .filter(
                    IPDatabase.project_uuid == project_uuid,
                    parsed_filters.ips
                )
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

            ids_limited = SubqueryBuilder.page_ids(
                ips_query, IPDatabase, page_number, page_size)

            ips_request = (
                session.query(
                    IPDatabase
                )
                .filter(
                    IPDatabase.project_uuid == project_uuid,
                    IPDatabase.id.in_(ids_limited),
                    parsed_filters.ips
                )
                .join(
                    scans_from_db, IPDatabase.ports,
                    isouter=(not scans_filters_exist)
                )
            )

            if files_filters_exist:
                ips_from_db =  (
                    ips_request
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
                            IPDatabase.ports, alias=scans_from_db
                        )
                    )
                    .all()
                )
            else:
                ips_from_db =  (
                    ips_request
                    .options(
                        joinedload(IPDatabase.hostnames),
                        contains_eager(
                            IPDatabase.ports, alias=scans_from_db
                        )
                    )
                    .all()
                )

            selected_ips = ips_query.from_self(IPDatabase.id).distinct().count()

        ips = sorted(
            list(
                map(
                    lambda each_ip: each_ip.dict(
                        include_ports=True,
                        include_hostnames=True
                        # include_files=True
                    ),
                    ips_from_db
                )
            ), key=lambda x: x['ip_address']
        )

        total_db_ips = self.count_ips(project_uuid)

        self.logger.info(
            "Selecting ips: from {} ips, filter: {}. Finished in {}. @{}".format(
                total_db_ips,
                filters,
                time.time() - t,
                project_uuid
            )
        )

        # Together with ips, return amount of total ips in the database
        return {
            "total_db_ips": total_db_ips,
            "selected_ips": selected_ips,
            "ips": ips
        }

    def count_ips(self, project_uuid):
        """ Counts ip entries in the database (for single project) """
        return IPDatabase.count(project_uuid)

    def count_hosts(self, project_uuid):
        """ Counts host entries in the database (for single project) """
        return HostDatabase.count(project_uuid)

    async def create_ip(self, ip_address, project_uuid):
        with self.session_spawner.get_session() as session:
            ips_locked = (
                session.query(
                    ProjectDatabase
                ).filter(
                    ProjectDatabase.project_uuid == project_uuid
                ).one().ips_locked
            )

            if ips_locked:
                return {
                    "status": "error",
                    "text": "Ips are locked"
                }
        
        return await IPDatabase.create(
            target=ip_address,
            project_uuid=project_uuid
        )

    async def create_batch_ips(self, ips, project_uuid):
        with self.session_spawner.get_session() as session:
            ips_locked = (
                session.query(
                    ProjectDatabase
                ).filter(
                    ProjectDatabase.project_uuid == project_uuid
                ).one().ips_locked
            )

            if ips_locked:
                return {
                    "status": "error",
                    "text": "Ips are locked"
                }

        results = {
            "status": "success",
            "new_scopes": []
        }

        to_add = []

        for ip_address in ips:
            if await IPDatabase.find(
                target=ip_address,
                project_uuid=project_uuid
            ) is None:
                to_add.append(ip_address)

        try:
            t = time.time()
            current_date = datetime.datetime.utcnow()

            new_ips = [
                {
                    "target": ip_address,
                    "comment": "",
                    "project_uuid": project_uuid,
                    "task_id": None,
                    "date_added": str(current_date)
                } for ip_address in to_add
            ]

            if new_ips:
                insert_res = self.session_spawner.engine.execute(
                    IPDatabase.__table__.insert(),
                    new_ips
                )

                with self.session_spawner.get_session() as session:
                    results["new_scopes"] = list(map(
                        lambda ip: ip.dict(),
                        (
                            session.query(
                                IPDatabase
                            ).filter(
                                IPDatabase.project_uuid == project_uuid,
                                IPDatabase.target.in_(to_add)
                            )
                        )
                    ))

            self.logger.info(
                "Added batch ips: {}@{} in {}".format(
                    ips,
                    project_uuid,
                    time.time() - t
                )
            )
        except Exception as exc:
            self.logger.error(
                "{} adding batch ips: {}@{}".format(
                    str(exc),
                    ips,
                    project_uuid
                )
            )
            
            return {"status": "error", "text": str(exc)}

        return results

    async def create_host(self, hostname, project_uuid):
        """ Creating a host we should first check whether it is already
        in the db, then create a new one if necessary """
        with self.session_spawner.get_session() as session:
            hosts_locked = (
                session.query(
                    ProjectDatabase
                ).filter(
                    ProjectDatabase.project_uuid == project_uuid
                ).one().hosts_locked
            )

            if hosts_locked:
                return {
                    "status": "error",
                    "text": "Hosts are locked"
                }

        return await HostDatabase.create(
            target=hostname,
            project_uuid=project_uuid
        )

    async def delete_scope(self, scope_id, scope_type):
        """ Deletes scope by its id """
        if scope_type == "ip_address":
            return await IPDatabase.delete_scope(scope_id)
        else:
            return await HostDatabase.delete_scope(scope_id)

    async def update_scope(self, scope_id, comment, scope_type):
        """ Update a comment on the scope """
        if scope_type == "ip_address":
            return await IPDatabase.update(scope_id, comment)
        else:
            return await HostDatabase.update(scope_id, comment)

    async def get_tasks_filtered(self, project_uuid, ips=None, hosts=None):
        """ Get the tasks associated with certain targets """
        get_result = await TaskDatabase.get_tasks(project_uuid, ips, hosts)

        if get_result["status"] == "success":
            return {
                "status": "success",
                "active": list(map(lambda task: task.dict(), get_result["active"])),
                "finished": list(map(lambda task: task.dict(), get_result["finished"]))
            }
        else:
            self.logger.error(get_result["text"])

            return get_result            

    async def resolve_scopes(self, scopes_ids, project_uuid):
        """ Using all the ids of scopes, resolve the hosts, now we
        resolve ALL the scopes, that are related to the project_uuid """
        self.resolver_called += 1

        with self.session_spawner.get_session() as session:
            # Select all hosts from the db
            project_hosts = session.query(HostDatabase).filter(
                HostDatabase.project_uuid == project_uuid
            ).options(joinedload(HostDatabase.ip_addresses)).all()

        if scopes_ids is None:
            to_resolve = project_hosts
        else:
            # Yet we cannot resolve only specific hosts.
            # TODO: add such possibility
            to_resolve = list(
                filter(lambda x: x.id in scopes_ids, project_hosts)
            )

        loop = asyncio.get_event_loop()

        try:
            nameservers_ips = await get_nameservers(
                map(lambda host: host.target, to_resolve),
                logger=self.logger
            )
            resolver = aiodns.DNSResolver(
                loop=loop, nameservers=nameservers_ips
            )

        except Exception as exc:
            self.logger.error(
                "{} during resolver setup {}@{}".format(
                    str(exc),
                    scopes_ids,
                    project_uuid
                )
            )

            resolver = aiodns.DNSResolver(loop=loop)

        current_retries = 0

        while current_retries < 3:
            resolve_results = await self._resolve(to_resolve, resolver)
            total_ips, failed_hosts = await self.parse_resolve_results(resolve_results, project_uuid, nameservers_ips)

            to_resolve = failed_hosts
            current_retries += 1

        if self.resolver_called % 5 == 0:
            print(self.debug_resolve_results)

        self.logger.info(
            "Successfully resolved {} ips @{}".format(
                len(to_resolve),
                project_uuid
            )
        )

        return (total_ips, 0)

    async def _resolve(self, hosts, resolver):
        futures = []
        resolve_results = []

        for each_host in hosts:
            each_future = resolver.query(each_host.target, "A")
            each_future.database_host = each_host
            futures.append(each_future)

            if len(futures) >= 10:
                (resolve_batch, _) = await asyncio.wait(
                    futures, return_when=asyncio.ALL_COMPLETED
                )
                resolve_results += resolve_batch
                futures = []

        if futures:
            (resolve_batch, _) = await asyncio.wait(
                futures, return_when=asyncio.ALL_COMPLETED
            )
            resolve_results += resolve_batch

        return resolve_results

    async def parse_resolve_results(self, resolve_results, project_uuid, nameservers_ips=None):
        failed_hosts = []
        total_ips = 0

        while resolve_results:
            await asyncio.sleep(0)

            each_future = resolve_results.pop()

            host = each_future.database_host
            hostname = host.target
            exc = each_future.exception()
            if exc:
                # An error during resolve happend
                exc_code = exc.args[0]
                exc_description = exc.args[1]

                if exc_code != 4:
                    print(exc_description)
                    failed_hosts.append(host)

                if hostname not in self.debug_resolve_results:
                    self.debug_resolve_results[hostname] = {
                        "status": "error",
                        "exception": {
                            "number": exc_code,
                            "description": exc_description
                        },
                        "nameservers": nameservers_ips
                    }
                else:
                    prev_result = self.debug_resolve_results[hostname]

                    if prev_result["status"] == "error":
                        if prev_result["exception"]["number"] != exc_code:
                            print("{} different exception: exc #{} -> #{}; {} -> {}".format(hostname, self.debug_resolve_results[hostname]["exception"]["number"], exc_code, self.debug_resolve_results[hostname]["exception"]["description"], exc_description))
                    else:
                        print("{} no longer resolves: exc #{} {}".format(hostname, exc_code, exc_description))
                continue

            result = each_future.result()
            if hostname not in self.debug_resolve_results:
                self.debug_resolve_results[hostname] = {
                    "status": "success",
                    "results": result.sort(),
                    "nameservers": nameservers_ips
                }
            else:
                prev_result = self.debug_resolve_results[hostname]

                if prev_result["status"] == "error":
                    print("{} now resolved. Old {}. New {} @ {}".format(hostname, prev_result, result, nameservers_ips))
                # else:
                    # print("{} no longer resolves: exc {}".format(hostname, self.debug_resolve_results[hostname]["exception"]))

            with self.session_spawner.get_session() as session:
                ips_locked = (
                    session.query(
                        ProjectDatabase
                    ).filter(
                        ProjectDatabase.project_uuid == project_uuid
                    ).one().ips_locked
                )

                for each_result in result:
                    total_ips += 1

                    resolved_ip = each_result.host
                    found_ip = await IPDatabase.find(
                        target=resolved_ip,
                        project_uuid=project_uuid
                    )

                    if found_ip:
                        found = False
                        for each_inner_ip_address in host.ip_addresses:
                            if each_inner_ip_address.id == found_ip.id:
                                found = True

                        if not found:
                            host.ip_addresses.append(session.merge(found_ip))
                            session.add(host)
                    elif not ips_locked:
                        ip_create_result = await IPDatabase.create(
                            target=resolved_ip,
                            project_uuid=project_uuid
                        )

                        if ip_create_result["status"] == "success":
                            newly_created_ip = ip_create_result["new_scope"]

                            host.ip_addresses.append(newly_created_ip)
                            session.add(host)

        return (total_ips, failed_hosts)