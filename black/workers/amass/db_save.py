""" Work with the database """
import uuid

from black.db import Sessions, HostDatabase, IPDatabase


class Saver:
    def __init__(self, task_id, project_uuid):
        self.task_id = task_id
        self.project_uuid = project_uuid

        self.session_spawner = Sessions()

    async def save_raw_output(self, output):
        print("saving '{}'".format(output))
        try:
            created_hosts = []
            created_ips = []

            targets = ''.join(output).strip().split()
            for target in targets:
                try:
                    splitted = target.split(',')
                    host = splitted[0]
                    ips = splitted[1:]
                except:
                    host = target
                    ips = []

                if self.find_anomalies(host):
                    print("[-] Hostname seems to be not valid", host)

                await self.save_host_ips(host, ips)

            return list(set(created_hosts))

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