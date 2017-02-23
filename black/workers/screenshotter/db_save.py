from uuid import uuid4

from black.models import Project, Scan, get_new_session, destroy_session


def save_screenshot_data(task_id, command, project_name, screenshot_path):
	session = get_new_session()
	project = session.query(Project).first()
	print("command=" + str(command))

	scans = session.query(Scan).filter_by(
		task_id=task_id,
		target=command["hostname"],
		port_number=command["port"]).all()

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
		scan.screenshot_path = screenshotter
		session.commit()

	destroy_session(session)
