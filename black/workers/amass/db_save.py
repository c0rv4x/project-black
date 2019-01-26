""" Work with the database """
import uuid

from black.db import Sessions, HostDatabase


def find_anomalies(hostname):
    if ' ' in host:
        return True
    return False

async def save_raw_output(task_id, output, project_uuid):
    try:
        sessions_manager = Sessions()
        created_hosts = []

        with sessions_manager.get_session() as session:
            hosts = ''.join(output).strip().split()
            print(hosts)

            for host in hosts:
                if find_anomalies(host):
                    print("[-] Hostname seems to be not valid", host)

                if HostDatabase.find(host, project_uuid) is None:
                    new_host = HostDatabase(
                        target=host,
                        task_id=task_id,
                        project_uuid=project_uuid
                    )

                    try:
                        session.add(new_host)
                        session.commit()
                        created_hosts.append(new_host)
                    except:
                        session.rollback()

        return list(set(created_hosts))

    except Exception as e:
        print("Exception while saving amass", str(e))
        raise e
