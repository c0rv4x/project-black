""" Work with the database """
import uuid
import xmltodict


from black.db import Sessions, ScanDatabase, IPDatabase


async def save_raw_output(task_id, output, project_uuid):
    try:
        sessions_manager = Sessions()
        concated = "".join(output)

        saved_scans = []

        if concated:
            parsed_dict = xmltodict.parse(concated)

            with sessions_manager.get_session() as session:
                if isinstance(parsed_dict['nmaprun']['host'], list):
                    for each_host in parsed_dict['nmaprun']['host']:
                        address = each_host['address']['@addr']
                        target = await IPDatabase.find(target=address, project_uuid=project_uuid)

                        port_data = each_host['ports']['port']
                        port_number = int(port_data['@portid'])
                        port_state = port_data['state']

                        if port_state != 'closed':
                            scan_id = str(uuid.uuid4())
                            new_scan = ScanDatabase(
                                scan_id=scan_id,
                                target=target.id,
                                port_number=port_number,
                                task_id=task_id,
                                project_uuid=project_uuid)

                            try:
                                session.add(new_scan)
                                session.commit()
                            except:
                                session.rollback()

                            saved_scans.append(target.id)
                else:
                    each_host = parsed_dict['nmaprun']['host']
                    address = each_host['address']['@addr']
                    target = await IPDatabase.find(target=address, project_uuid=project_uuid)

                    port_data = each_host['ports']['port']
                    port_number = int(port_data['@portid'])
                    port_state = port_data['state']

                    if port_state != 'closed':
                        scan_id = str(uuid.uuid4())
                        new_scan = ScanDatabase(
                            scan_id=scan_id,
                            target=target.id,
                            port_number=port_number,
                            task_id=task_id,
                            project_uuid=project_uuid)

                        try:
                            session.add(new_scan)
                            session.commit()
                        except:
                            session.rollback()

                        saved_scans.append(target.id)

            return list(set(saved_scans))

    except Exception as e:
        # TODO: add logger here
        print("save_raw_output")
        print(e)
        raise e
