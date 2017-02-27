import json
from uuid import uuid4

from black.db import Project, Scan, get_new_session, destroy_session


def save_screenshot_data(target, scan_id, project_name, screenshot_path, task_id):
	session = get_new_session()
	print("target=" + str(target))

	scans = session.query(Scan).filter_by(
		target=target["hostname"],
		port_number=target["port"],
		scan_id=scan_id).all()

	print(scans)
	if len(scans) > 1:
		# TODO: add logger
		print("HEY, error here: screenshotter/db_save.py. Multiple shits")
		print(scans)

	elif len(scans) == 0:
		# TODO: add logger
		print("Hey, error occured: race condition screenshotter/db_save.py")
	else:
		scan = scans[0]
		scan.screenshot_path = screenshot_path

		old_tasks_ids = scan.tasks_ids
		if old_tasks_ids is None:
			new_tasks_ids = [task_id]
		else:
			new_tasks_ids = json.loads(old_tasks_ids)
			new_tasks_ids.append(task_id)

		scan.tasks_ids = json.dumps(new_tasks_ids)

		session.commit()

	destroy_session(session)
