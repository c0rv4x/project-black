import uuid
import time
import aiodns
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

@log
class ScopeManager(object):
    """ ScopeManager keeps track of all ips and hosts in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.session_spawner = Sessions()

    def get_hosts(
        self, filters,  project_uuid,
        page_number=None, page_size=None, hosts_only=False
    ):
        """ Returns hosts associated with a given project.
        Not all hosts are returned. Only those that are within
        the described page"""

        t = time.time()

        with self.session_spawner.get_session() as session:
            # Parse filters into an object for more comfortable work
            parsed_filters = Filters.parse_filters(filters)

            # Create scans subquery
            if filters.get('port', False) or filters.get('protocol') or filters.get('banner'):
                scans_filters_exist = True
            else:
                scans_filters_exist = False

            scans_from_db = SubqueryBuilder.build_scans_subquery(
                session, project_uuid, filters)

            # Create IPS subquery

            ip_filters_exist = filters.get('ip', False)

            ips_query = (
                session.query(
                    IPDatabase
                )
                .filter(
                    IPDatabase.project_uuid == project_uuid,
                    parsed_filters['ips']
                )
            )

            ips_query_subq = aliased(
                IPDatabase, ips_query.subquery('all_ips_parsed'))

            # Create files subquery

            files_filters_exist = filters.get('files', False)

            files_query_aliased = SubqueryBuilder.build_files_subquery(
                session, project_uuid, filters)

            # Create hosts subquery

            hosts_query = (
                session.query(
                    HostDatabase
                )
                .filter(
                    HostDatabase.project_uuid == project_uuid,
                    parsed_filters['hosts']
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


            print('-'*20)
            # Now select hosts, joining them with
            # all other subqueries from the prev step
            hosts_from_db = (
                session.query(HostDatabase)
                .filter(
                    HostDatabase.project_uuid == project_uuid,
                    HostDatabase.id.in_(hosts_limited),
                    parsed_filters['hosts']
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
                # .order_by(HostDatabase.target)
                .all()
            )
            print('-'*20)


        # Reformat each hosts to JSON-like objects
        hosts = sorted(
                map(lambda each_host: each_host.dict(
                include_ips=True,
                include_files=True,
                include_ports=True
            ), hosts_from_db)
        , key=lambda x: x['hostname'])

        total_db_hosts = self.count_hosts(project_uuid)
    
        self.logger.info(
            "Selecting hosts: from {} hosts, filter: {}. Finished in {}. @{}".format(
                total_db_hosts,
                filters,
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

    def get_ips(
        self, filters, project_uuid,
        page_number=None, page_size=None, ips_only=False,
        ips_and_ports=False
    ):
        """ Returns ips that are associated with a given project.
        Not all ips are selected. Only those, that are within the
        described page """
        t = time.time()

        with self.session_spawner.get_session() as session:
            # Parse filters into an object for more comfortable work
            parsed_filters = Filters.parse_filters(filters)

            # Scans
            if filters.get('port', False) or filters.get('protocol') or filters.get('banner'):
                scans_filters_exist = True
            else:
                scans_filters_exist = False

            # scans_filters_exist = parsed_filters['ports'] is not True
            scans_from_db = SubqueryBuilder.build_scans_subquery(
                session, project_uuid, filters)

            # Files
            if filters.get('files', False):
                files_filters_exist = True
            else:
                files_filters_exist = False
            
            # files_filters_exist = filters.get('files', False)

            files_query_aliased = SubqueryBuilder.build_files_subquery(
                session, project_uuid, filters)

            # Now select ips, outer joining them with scans
            ips_query = (
                session.query(IPDatabase)
                .filter(
                    IPDatabase.project_uuid == project_uuid,
                    parsed_filters['ips']
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
                    .distinct()
                    .all()
                )
            elif ips_and_ports:
                ips_from_db = (
                    session.query(
                        ips_query_subq.target,
                        ips_query_subq.port_number
                    )
                    .filter(ips_query_subq.id.in_(ids_limited))
                    .distinct()
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
                        parsed_filters['ips']
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
                            IPDatabase.ports, alias=scans_from_db
                        )
                    )
                    # .order_by(IPDatabase.target)
                    .all()
                )

            selected_ips = ips_query.from_self(IPDatabase.id).distinct().count()

        if ips_only:
            ips = sorted(list(map(lambda each_ip: each_ip[0], ips_from_db)))
            # ips = list(map(lambda each_ip: each_ip[0], ips_from_db))
        else:
            # Reformat the ips to make the JSON-like objects
            ips = sorted(
                list(
                    map(
                        lambda each_ip: each_ip.dict(
                            include_ports=True,
                            include_hostnames=True,
                            include_files=True
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

    def create_ip(self, ip_address, project_uuid):
        return IPDatabase.create(
            target=ip_address,
            project_uuid=project_uuid
        )

    def create_batch_ips(self, ips, project_uuid):
        results = {
            "status": "success",
            "new_scopes": []
        }

        to_add = []

        for ip_address in ips:
            if IPDatabase.find(
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

    def create_host(self, hostname, project_uuid):
        """ Creating a host we should first check whether it is already
        in the db, then create a new one if necessary """
        return HostDatabase.create(
            target=hostname,
            project_uuid=project_uuid
        )

    def delete_scope(self, scope_id, scope_type):
        """ Deletes scope by its id """
        if scope_type == "ip_address":
            return IPDatabase.delete_scope(scope_id)
        else:
            return HostDatabase.delete_scope(scope_id)

    def update_scope(self, scope_id, comment, scope_type):
        """ Update a comment on the scope """
        if scope_type == "ip_address":
            return IPDatabase.update(scope_id, comment)
        else:
            return HostDatabase.update(scope_id, comment)

    def get_tasks_filtered(self, project_uuid, ips=None, hosts=None):
        """ Get the tasks associated with certain targets """
        get_result = TaskDatabase.get_tasks(project_uuid, ips, hosts)

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
        total_ips = 0
        new_ips = 0

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

        loop = asyncio.get_event_loop()

        try:
            top_server_name = '.'.join(to_resolve[0].target.split('.')[-2:])
            resolver = aiodns.DNSResolver(loop=loop)
            result = await resolver.query(top_server_name, "NS")
            nameservers = list(map(lambda x: x.host, result))

            self.logger.debug(
                "Scopes resolve, found NSes: {}".format(
                    nameservers
                )
            )

            futures = []
            for ns in nameservers:
                each_future = resolver.query(ns, "A")
                futures.append(each_future)

            (done_futures, _) = await asyncio.wait(
                futures, return_when=asyncio.ALL_COMPLETED
            )

            nameservers_ips = ['8.8.8.8']

            while done_futures:
                each_future = done_futures.pop()

                try:
                    result = each_future.result()
                    nameservers_ips += list(map(lambda x: x.host, result))
                except Exception as e:
                    pass

            self.logger.debug(
                "Scopes resolve, resolved NSes: {}".format(
                    nameservers_ips
                )
            )

            resolver = aiodns.DNSResolver(
                loop=loop, nameservers=nameservers_ips
            )

        except Exception as exc:
            self.logger.error(
                "{} during resolve {}@{}".format(
                    str(exc),
                    scopes_ids,
                    project_uuid
                )
            )

            resolver = aiodns.DNSResolver(loop=loop)

        futures = []
        done_futures_all = []

        for each_host in to_resolve:
            each_future = resolver.query(each_host.target, "A")
            each_future.database_host = each_host
            futures.append(each_future)

            if len(futures) >= 10:
                (done_futures, _) = await asyncio.wait(
                    futures, return_when=asyncio.ALL_COMPLETED
                )
                done_futures_all += done_futures
                futures = []

        if futures:
            (done_futures, _) = await asyncio.wait(
                futures, return_when=asyncio.ALL_COMPLETED
            )
            done_futures_all += done_futures
        futures = []                

        while done_futures_all:
            await asyncio.sleep(0)

            each_future = done_futures_all.pop()

            try:
                exc = each_future.exception()
                host = each_future.database_host
                result = each_future.result()
            except Exception as exc:
                pass
                # self.logger.error(
                #     "{} during resolve {}@{}".format(
                #         str(exc),
                #         each_future.database_host,
                #         project_uuid
                #     )
                # )

            for each_result in result:
                # Well, this is strange, but ip in aiodns is returned in 'host'
                # field
                total_ips += 1

                resolved_ip = each_result.host
                found_ip = IPDatabase.find(
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
                else:
                    ip_create_result = IPDatabase.create(
                        target=resolved_ip,
                        project_uuid=project_uuid
                    )

                    if ip_create_result["status"] == "success":
                        newly_created_ip = ip_create_result["new_scope"]

                        host.ip_addresses.append(newly_created_ip)
                        session.add(host)
        session.commit()
        self.session_spawner.destroy_session(session)

        self.logger.info(
            "Successfully resolved {} ips @{}".format(
                len(to_resolve),
                project_uuid
            )
        )

        return (total_ips, new_ips)
