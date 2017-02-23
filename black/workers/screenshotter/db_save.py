from black.models import Project, get_new_session, destroy_session


def save_screenshot_data(task_id, command, project_name, screenshot_path):
	session = get_new_session()
	project = session.query(Project).first()

	

	destroy_session(session)
