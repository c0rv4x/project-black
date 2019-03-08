""" Work with the database """
import re
import uuid
from datetime import datetime

from black.db import Sessions, HostDatabase, IPDatabase


HOSTNAME_REGEX = "^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$"
IP_REGEX = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$"


class Saver:
    def __init__(self, task_id, project_uuid):
        self.task_id = task_id
        self.project_uuid = project_uuid

        self.session_spawner = Sessions()

    async def save_raw_output(self, output):
        print("saving amass {}".format(self.task_id))
        with open("amass-{}".format(self.task_id), 'w') as f:
            f.write(''.join(output))

        try:
            updated_hosts = False
            updated_ips = False

            targets = ''.join(output).strip().split()
            for target in targets:
                try:
                    splitted = target.split(',')
                    host = splitted[0]
                    if not re.match(HOSTNAME_REGEX, host):
                        print("{} not valid hostname for {}".format(host, self.task_id))

                        splitted = target.split(' ')
                        host = splitted[0]
                        ips = target[1].split(',')
                        if not re.match(HOSTNAME_REGEX, host):
                            print("  {} not valid hostname for {}".format(host, self.task_id))

                            continue

                    else:
                        ips = splitted[1:]
                except:
                    host = target
                    ips = []

                if self.find_anomalies(host):
                    print("[-] Hostname seems to be not valid", host)

                new_hosts, new_ips = await self.save_host_ips(host, ips)
                updated_hosts = updated_hosts or new_hosts
                updated_ips = updated_ips or new_ips

            return updated_hosts, updated_ips

        except Exception as e:
            print("Exception while saving amass", str(e))
            raise e

    @staticmethod
    def find_anomalies(hostname):
        if ' ' in hostname:
            return True
        return False

    async def save_host_ips(self, host, ips):
        updated_hosts = False
        updated_ips = False

        host_db, created = await HostDatabase.get_or_create(host, self.project_uuid, self.task_id)

        if created:
            updated_hosts = True

        for ip in ips:
            if not re.match(IP_REGEX, ip):
                print("{} not valid ip for {}".format(ip, self.task_id))
                continue

            ip_db, created = await IPDatabase.get_or_create(ip, self.project_uuid, self.task_id)

            if created:
                updated_ips = True

            if host_db and ip_db:
                found = False
                for ip_db_host in host_db.ip_addresses:
                    if ip_db_host.id == ip_db.id:
                        found = True
                        break

                if not found:
                    host_db.ip_addresses.append(ip_db)

                with self.session_spawner.get_session() as session:
                    try:
                        session.add(host_db)
                        session.commit()
                        updated_hosts = True
                        updated_ips = True
                    except Exception as exc:
                        session.rollback()
                        print("[-] Save exception of {}+{}: {}".format(host, ip, exc))

        return updated_hosts, updated_ips