""" Module keeps ScopeManager, which creates/deletes/updates scopes.
Scope can be represented with ip_address, or hostname.
Hostname can have ip_address as a parameter (ForeignKey in the DB).
Ip_address can contain hostname (if they are known), which is in fact
a one->many relationship in the SQLalchemy. """
import asyncio
import aiodns

from black.black.db import Sessions, IPDatabase, ProjectDatabase, HostDatabase
from managers.scopes.ip_internal import IPInternal
from managers.scopes.host_internal import HostInternal


class ScopeManager(object):
    """ ScopeManager keeps track of all ips and hosts in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.ips = {}
        self.hosts = {}

        self.inited = {}
        self.session_spawner = Sessions()

    def create_ip(self, ip_address, project_uuid, result_jsoned=True):
        """ Create IP object, save and add that to the ips list """
        if self.find_ip(
            ip_address=ip_address, project_uuid=project_uuid
        ) is not None:
            return {"status": "dupliacte"}

        new_ip = IPInternal(ip_address, project_uuid, session_spawner=self.session_spawner)
        save_result = new_ip.save()

        if save_result["status"] == "success":
            self.ips[project_uuid][ip_address] = new_ip

            return {
                "status": "success",
                "type": "ip_address",
                "new_scope": new_ip.to_json() if result_jsoned else new_ip
            }

        return save_result

    def create_batch_ips(self, ip_addresses, project_uuid):
        """ Creates a lot of ips """
        # import cProfile, pstats, io
        # pr = cProfile.Profile()
        # pr.enable()

        new_ip_addresses = filter(lambda ip_address: self.find_ip(
            ip_address=ip_address, project_uuid=project_uuid) is None, ip_addresses)

        ips_objects = list(map(lambda ip_address: IPInternal(ip_address=ip_address,
                                                             project_uuid=project_uuid,
                                                             session_spawner=self.session_spawner),
                               new_ip_addresses))

        db_objects = map(lambda ip_object: ip_object.save(
            commit=False), ips_objects)

        try:
            session = self.session_spawner.get_new_session()
            for db_object in db_objects:
                session.add(db_object)

            session.commit()
            self.session_spawner.destroy_session(session)
        except Exception as exc:
            print("Error when saving ip", exc)
            return {'status': 'error', 'text': str(exc)}
        else:
            for each_ip in ips_objects:
                ip_address = each_ip.get_ip_address()
                self.ips[project_uuid][ip_address] = each_ip


            # pr.disable()
            # s = io.StringIO()
            # sortby = 'cumulative'
            # ps = pstats.Stats(pr, stream=s).sort_stats(sortby)
            # ps.print_stats()
            # print(s.getvalue())

            return {
                'status': 'success',
                'new_scopes': list(map(lambda x: x.to_json(), ips_objects))
            }

    def create_host(self, hostname, project_uuid, result_jsoned=True):
        """ Create host object, save and add that to the hosts list """
        if self.find_host(
            hostname=hostname, project_uuid=project_uuid
        ) is not None:
            return {"status": "dupliacte"}

        new_host = HostInternal(hostname=hostname,
                                project_uuid=project_uuid,
                                session_spawner=self.session_spawner)
        save_result = new_host.save()

        if save_result["status"] == "success":
            self.hosts[project_uuid][hostname] = new_host

            return {
                "status": "success",
                "type": "hostname",
                "new_scope": new_host.to_json() if result_jsoned else new_host
            }

        return save_result

    def get_ips(self, project_uuid):
        """ Returns a formatted list of known ips, filtered by project_uuid """
        if not self.inited.get(project_uuid, False):
            self.update_from_db(project_uuid)
            self.inited[project_uuid] = True

        if self.ips.get(project_uuid, False) is False:
            self.ips[project_uuid] = {}

        ips_filtered = self.ips[project_uuid]

        return list(map(lambda x: x.to_json(), ips_filtered.values()))

    def get_hosts(self, project_uuid):
        """ Returns a formatted list of known hosts, filtered by project_uuid """
        if not self.inited.get(project_uuid, False):
            self.update_from_db(project_uuid)
            self.inited[project_uuid] = True

        if self.hosts.get(project_uuid, False) is False:
            self.hosts[project_uuid] = {}

        hosts_filtered = self.hosts[project_uuid]

        return list(map(lambda x: x.to_json(), hosts_filtered.values()))

    def update_from_db(self, project_uuid=None):
        """ Extract all the ips from the DB """
        self.ips = {}
        self.hosts = {}

        # If no project_uuid was specified, find data for all projects
        session = self.session_spawner.get_new_session()
        project_uuids = session.query(ProjectDatabase.project_uuid).all()
        if project_uuid is not None:
            project_uuids = [(project_uuid, )]

        for each_project_uuid_tupled in project_uuids:
            each_project_uuid = each_project_uuid_tupled[0]
            self.ips[each_project_uuid] = {}
            self.hosts[each_project_uuid] = {}

            # IPS
            # Remember a link to the dict which we are filling now
            ips_dict = self.ips[each_project_uuid]

            # Iterate over all ips from the db and put the to the special dict
            ips_from_db = session.query(IPDatabase).filter(
                IPDatabase.project_uuid == each_project_uuid).distinct().all()

            print("I found {} ips".format(len(ips_from_db)))

            # Transform ips from db to our internal representation
            for each_value in ips_from_db:
                db_dict = each_value.__dict__

                ip_id = db_dict['ip_id']
                ip_address = db_dict['ip_address']
                project_uuid = db_dict['project_uuid']
                comment = db_dict['comment']
                hostnames = []

                ips_dict[ip_address] = IPInternal(ip_id=ip_id,
                                                  ip_address=ip_address,
                                                  project_uuid=project_uuid,
                                                  comment=comment,
                                                  hostnames=hostnames,
                                                  session_spawner=self.session_spawner)

            # Hosts
            # Remember a link to the dict which we are filling now
            hosts_dict = self.hosts[each_project_uuid]

            # Iterate over all hosts from the db and put the to the special
            # dict
            hosts_from_db = session.query(HostDatabase).filter(
                HostDatabase.project_uuid == each_project_uuid).distinct().all()
            print("I found {} hosts".format(len(hosts_from_db)))

            # Transform ips from db to our internal representation
            for each_value in hosts_from_db:
                db_dict = each_value.__dict__

                host_id = db_dict['host_id']
                hostname = db_dict['hostname']
                project_uuid = db_dict['project_uuid']
                comment = db_dict['comment']

                # IPs objects are already created so we will do the following:
                # 1. HostDatabse keeps info on the ips
                ip_addresses = db_dict.get('ip_addresses', [])

                # 2. Map these db objects to our internal objects
                ips_dict = self.ips[each_project_uuid]
                ips_internal = list(map(lambda ip_address: ips_dict.get(ip_address.ip_address), ip_addresses))

                # 3. Create a host object with those ips
                host = HostInternal(host_id=host_id,
                                    hostname=hostname,
                                    project_uuid=project_uuid,
                                    comment=comment,
                                    ip_addresses=ips_internal,
                                    session_spawner=self.session_spawner)
                hosts_dict[hostname] = host

                # 4. For each ip assign a hostname
                for each_ip in ips_internal:
                    each_ip.append_host(host, save=False)

            # print("Done initing")
            # from pympler import summary, muppy
            # all_objects = muppy.get_objects()
            # sum1 = summary.summarize(muppy.filter(all_objects, Type=IPInternal))
            # summary.print_(sum1) 

        self.session_spawner.destroy_session(session)

    def find_ip(self, ip_address=None, project_uuid=None, ip_id=None):
        """ Checks whether ip object for a certain project already exitst """
        project_ips = self.ips.get(project_uuid, [])

        if ip_address is not None:
            return project_ips.get(ip_address, None)

        if ip_id is not None:
            for key in project_ips.keys():
                each_ip = project_ips[key]
                if each_ip.get_id() == ip_id:
                    return each_ip

        return None

    def find_host(self, hostname=None, project_uuid=None, host_id=None):
        """ Checks whether host object for a certain project already exitst """
        project_hosts = self.hosts.get(project_uuid, [])

        if hostname is not None:
            return project_hosts.get(hostname, None)

        if host_id is not None:
            for key in project_hosts.keys():
                host = project_hosts[key]
                if host.get_id() == host_id:
                    return host

        return None

    def delete_scope(self, scope_id, project_uuid):
        """ Removes scope from the database and internal structures """
        host = self.find_host(host_id=scope_id, project_uuid=project_uuid)

        if host is not None:
            hostname = host.get_hostname()
            delete_result = host.delete()

            if delete_result["status"] == "success":
                self.hosts[project_uuid].pop(hostname, None)

                for each_ip in host.get_ip_addresses():
                    each_ip.remove_host(host)

            return delete_result

        else:
            ip_addr = self.find_ip(ip_id=scope_id, project_uuid=project_uuid)

            if ip_addr is not None:
                ip_address = ip_addr.get_ip_address()
                delete_result = ip_addr.delete()

                if delete_result["status"] == "success":
                    self.ips[project_uuid].pop(ip_address, None)

                    for each_host in ip_addr.get_hostnames():
                        each_host.remove_ip_address(ip_addr)

                print(delete_result)
                return delete_result

            else:
                return {"status": "error", "text": "Host/IP does not exist"}

    def update_scope(self, scope_id, comment):
        """ Update scope by its id. Fow we can update only comment """
        for ip_addr in self.ips:
            if ip_addr.get_id() == scope_id:
                update_result = ip_addr.update_comment(comment)
                update_result['updated_scope'] = ip_addr.to_json()
                update_result['type'] = 'ip'

                return update_result

        for host in self.hosts:
            if host.get_id() == scope_id:
                update_result = host.update_comment(comment)
                update_result['updated_scope'] = host.to_json()
                update_result['type'] = 'host'

                return update_result

    async def resolve_scopes(self, scopes_ids, project_uuid):
        """ Using all the ids of scopes, resolve the hosts, now we
        resolve ALL the scopes, that are related to the project_uuid """
        project_hosts = self.hosts.get(project_uuid, [])
        if scopes_ids is None:
            to_resolve = project_hosts.values()
        else:
            # This should not work for now, but TODO: make it actually work
            to_resolve = list(
                filter(lambda x: x.get_id() in scopes_ids, project_hosts)
            )

        resolver = aiodns.DNSResolver(loop=asyncio.get_event_loop())
        futures = []

        for each_host in to_resolve:
            each_future = resolver.query(each_host.get_hostname(), "A")
            each_future.internal_host = each_host
            futures.append(each_future)

        (done_futures, _) = await asyncio.wait(
            futures, return_when=asyncio.ALL_COMPLETED
        )

        while done_futures:
            each_future = done_futures.pop()

            try:
                exc = each_future.exception()
                result = each_future.result()
                host = each_future.internal_host
            except Exception:
                continue

            if exc:
                print("RESOLVE EXCEPTION", each_future, exc)

            for each_result in result:
                # Well, this is strange, but ip in aiodns is returned in 'host'
                # field
                resolved_ip = each_result.host
                found_ip = self.find_ip(resolved_ip, project_uuid)

                if found_ip:
                    host.append_ip(found_ip)
                    found_ip.append_host(host)
                else:
                    ip_create_result = self.create_ip(
                        resolved_ip, project_uuid, result_jsoned=False
                    )

                    if ip_create_result["status"] == "success":
                        newly_created_ip = ip_create_result["new_scope"]
                        host.append_ip(newly_created_ip)
                        newly_created_ip.append_host(host)
