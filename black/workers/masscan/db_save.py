""" Work with the database """
import xmltodict
from uuid import uuid4

from black.db import sessions, Scan


def save_raw_output(task_id, output, project_name):
	try:
		concated = "".join(map(lambda x: x.decode(), output))
		parsed_dict = xmltodict.parse(concated)

		open_ports = dict()
		session = sessions.get_new_session()
		for each_host in parsed_dict['nmaprun']['host']:
			address = each_host['address']['@addr']

			port_data = each_host['ports']['port']

			protocol = port_data['@protocol']
			port_number = int(port_data['@portid'])

			port_state = port_data['state']
			port_status = port_state['@state']
			port_reason = port_state['@reason']

			if port_state != 'closed':
				new_scan = Scan(
					scan_id=str(uuid4()),
					target=address,
					port_number=port_number,
					tasks_ids=str([task_id]),
					project_name=project_name)

				session.add(new_scan)
				session.commit()

		sessions.destroy_session(session)

	except Exception as e:
		# TODO: add logger here
		print(e)
