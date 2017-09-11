import uuid

from black.db import Sessions, Host, IP_addr


def add_ip_address(session, ip_address, task_id, project_uuid):
    ips_from_db = session.query(IP_addr).all()

    filtered = list(filter(lambda x: x.project_uuid == project_uuid, ips_from_db))
    filtered = list(filter(lambda x: x.ip_address == ip_address, filtered))

    ip_id = None

    if len(filtered) == 0:
        ip_id = str(uuid.uuid4())

        db_object = IP_addr(
            ip_id=ip_id,
            ip_address=ip_address,
            hostnames=[],
            comment="",
            project_uuid=project_uuid,
            task_id=task_id)

        session.add(db_object)
        session.commit()

    else:
        existing_ip = filtered[0]
        ip_id = existing_ip.ip_id

    return ip_id

def add_hostname(session, hostname, task_id, project_uuid):
    hosts_from_db = session.query(Host).all()

    filtered = list(filter(lambda x: x.project_uuid == project_uuid, hosts_from_db))
    filtered = list(filter(lambda x: x.hostname == hostname, filtered))

    host_id = None

    if len(filtered) == 0:
        host_id = str(uuid.uuid4())

        db_object = Host(
            host_id=host_id,
            hostname=hostname,
            ip_addresses=[],
            comment="",
            project_uuid=project_uuid,
            task_id=task_id)

        session.add(db_object)
        session.commit()

    else:
        existing_host = filtered[0]
        host_id = existing_host.host_id

    return host_id  

def double_append(session, host_id, ip_id):
    ip_from_db = session.query(IP_addr).filter_by(ip_id=ip_id).first()
    host_from_db = session.query(Host).filter_by(host_id=host_id).first()

    ip_from_db.hostnames.append(host_from_db)
    host_from_db.ip_addresses.append(ip_from_db)

    session.commit()


def save(hostname, ip_address, task_id, project_uuid):
    sessions = Sessions()
    session = sessions.get_new_session()

    ip_id = add_ip_address(session, ip_address, task_id, project_uuid)
    host_id = add_hostname(session, hostname, task_id, project_uuid)

    double_append(session, host_id, ip_id)
    sessions.destroy_session(session)

    return {
        "host_id": host_id,
        "ip_id": ip_id
    }
