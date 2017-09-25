""" Module keeps ScopeManager, which creates/deletes/updates scopes.
Scope can be represented with ip_address, or hostname.
Hostname can have ip_address as a parameter (ForeignKey in the DB).
Ip_address can contain hostname (if they are known), which is in fact
a one->many relationship in the SQLalchemy. """
import asyncio
import aiodns
import uuid

from managers.resolver import Resolver, ResolverTimeoutException
from black.black.db import Sessions, IP_addr
from black.black.db import Host as HostDB
from managers.scopes.ip import IP
from managers.scopes.host import Host as HostInstance


class ScopeManager(object):
    """ ScopeManager keeps track of all ips and hosts in the system,
    exposing some interfaces for public use. """

    def __init__(self):
        self.ips = []
        self.hosts = []

        self.sessions = Sessions()

        self.update_from_db()

    def create_ip(self, ip_address, project_uuid, result_jsoned=True):
        """ Create IP object, save and add that to the ips list """
        if self.find_ip(
            ip_address=ip_address, project_uuid=project_uuid
        ) is not None:
            return {"status": "dupliacte"}

        new_ip = IP(str(uuid.uuid4()), ip_address, project_uuid, sessions=self.sessions)
        save_result = new_ip.save()

        if save_result["status"] == "success":
            self.ips.append(new_ip)

            return {
                "status": "success",
                "type": "ip_address",
                "new_scope": new_ip.to_json() if result_jsoned else new_ip
            }

        return save_result

    def create_host(self, hostname, project_uuid, result_jsoned=True):
        """ Create host object, save and add that to the hosts list """
        if self.find_host(
            hostname=hostname, project_uuid=project_uuid
        ) is not None:
            return {"status": "dupliacte"}

        new_host = HostInstance(str(uuid.uuid4()), hostname, project_uuid, sessions=self.sessions)
        save_result = new_host.save()

        if save_result["status"] == "success":
            self.hosts.append(new_host)

            return {
                "status": "success",
                "type": "hostname",
                "new_scope": new_host.to_json() if result_jsoned else new_host
            }

        return save_result

    def get_ips(self, project_uuid=None):
        """ Returns a formatted list of known ips, filtered by project_uuid """
        ips_filtered = list(
            filter(
                lambda x: project_uuid is None or x.get_project_uuid() == project_uuid,
                self.ips
            )
        )

        return list(map(lambda x: x.to_json(), ips_filtered))

    def get_hosts(self, project_uuid=None):
        """ Returns a formatted list of known hosts, filtered by project_uuid """
        hosts_filtered = list(
            filter(
                lambda x: project_uuid is None or x.get_project_uuid() == project_uuid,
                self.hosts
            )
        )

        return list(map(lambda x: x.to_json(), hosts_filtered))

    def update_from_db(self):
        """ Extract all the ips from the DB """
        session = self.sessions.get_new_session()

        ips_from_db = session.query(IP_addr).all()
        self.ips = list(map(lambda x: IP(x.ip_id,
                                         x.ip_address,
                                         x.project_uuid,
                                         list(map(lambda x: x.hostname, x.hostnames)),
                                         x.comment,
                                        sessions=self.sessions),
                            ips_from_db))

        hosts_from_db = session.query(HostDB).all()
        self.hosts = list(map(lambda x: HostInstance(x.host_id,
                                                     x.hostname,
                                                     x.project_uuid,
                                                     list(map(lambda x: x.ip_address, x.ip_addresses)),
                                                     x.comment,
                                                     sessions=self.sessions),
                              hosts_from_db))

        self.sessions.destroy_session(session)

        for each_ip in self.ips:
            nice_hostnames = list(
                filter(
                    lambda y: y.get_hostname() in each_ip.get_hostnames() and y.get_project_uuid() == each_ip.get_project_uuid(),
                    self.hosts
                )
            )
            each_ip.set_hostnames(nice_hostnames)

        for each_host in self.hosts:
            nice_ips = list(
                filter(
                    lambda y: y.get_ip_address() in each_host.get_ip_addresses() and y.get_project_uuid() == each_host.get_project_uuid(),
                    self.ips
                )
            )
            each_host.set_ip_addresses(nice_ips)

    def find_ip(self, ip_address=None, project_uuid=None, ip_id=None):
        """ Checks whether ip object for a certain project already exitst """
        filtered = self.ips
        filtered = list(
            filter(
                lambda x:
                    (ip_address is None or x.get_ip_address() == ip_address)
                and (project_uuid is None or x.get_project_uuid() == project_uuid)
                and (ip_id is None or x.get_id() == ip_id),
                filtered
            )
        )

        return filtered[0] if filtered else None

    def find_host(self, hostname=None, project_uuid=None, host_id=None):
        """ Checks whether host object for a certain project already exitst """
        filtered = self.hosts

        filtered = list(
            filter(
                lambda x:
                    (hostname is None or x.get_hostname() == hostname)
                and (project_uuid is None or x.get_project_uuid() == project_uuid)
                and (host_id is None or x.get_id() == host_id),
                filtered
            )
        )

        return filtered[0] if filtered else None

    def delete_scope(self, scope_id):
        """ Removes scope from the database and internal structures """
        host = self.find_host(host_id=scope_id)

        if host is not None:
            delete_result = host.delete()

            if delete_result["status"] == "success":
                self.hosts.remove(host)

                for each_ip in self.ips:
                    each_ip.remove_host(host)

            return delete_result

        else:
            ip_addr = self.find_ip(ip_id=scope_id)

            if ip_addr is not None:
                delete_result = ip_addr.delete()

                if delete_result["status"] == "success":
                    self.ips.remove(ip_addr)

                    for each_host in self.hosts:
                        each_host.remove_ip_address(ip_addr)

                return delete_result

            else:
                return {"status": "error", "text": "Host/IP does not exist"}

    def update_scope(self, scope_id, comment):
        """ Update scope by its id. Fow we can update only comment """
        for ip_addr in self.ips:
            if ip_addr.get_id() == scope_id:
                update_result = ip_addr.update_comment(comment)
                update_result['updated_scope'] = ip_addr.toJSON()
                update_result['type'] = 'ip'

                return update_result

        for host in self.hosts:
            if host.get_id() == scope_id:
                update_result = host.update_comment(comment)
                update_result['updated_scope'] = host.toJSON()
                update_result['type'] = 'host'

                return update_result

    async def resolve_scopes(self, scopes_ids, project_uuid):
        """ Using all the ids of scopes, resolve the hosts, now we
        resolve ALL the scopes, that are related to the project_uuid """
        filtered_hosts = list(
            filter(lambda x: x.get_project_uuid() == project_uuid, self.hosts)
        )
        if scopes_ids is None:
            to_resolve = filtered_hosts
        else:
            to_resolve = list(
                filter(lambda x: x.get_id() in scopes_ids, filtered_hosts)
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
            except Exception as e:
                continue

            if exc:
                print("RESOLVE EXCEPTION", each_future, exc)

            for each_result in result:
                # Well, this is strange, but ip in aiodns is returned in 'host' field
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
