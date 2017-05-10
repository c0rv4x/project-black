from uuid import uuid4

from black.db import sessions, Host, IP_addr


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

        db_object = IP_addr(
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


def save(hostname, ip_address, task_id, project_uuid):
    session = sessions.get_new_session()

    ip_id = add_ip_address(session, ip_address, task_id, project_uuid)
    host_id = add_hostname(session, hostname, task_id, project_uuid)

    print("Ok", ip_id, host_id)

    # session = sessions.get_new_session()
    # db_object = HostDB(host_id=str(uuid4()),
    #                    hostname=self.get_hostname(),
    #                    comment=self.get_comment(),
    #                    project_uuid=self.get_project_uuid())
    # session.add(db_object)
    # session.commit()
    # sessions.destroy_session(session)

    # host_id = str(uuid4())
    # hostname = hostname
    # ip_addresses = relationship("IP_addr", secondary=association_table, back_populates="hostnames")
    # comment = Column(String)
    # task_id = Column(String, ForeignKey('tasks.task_id'))
    # project_uuid = Column(String, ForeignKey('projects.project_uuid', ondelete='CASCADE'))
    # date_added = Column(DateTime, default=datetime.datetime.utcnow)