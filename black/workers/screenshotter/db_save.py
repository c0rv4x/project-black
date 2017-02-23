from black.models import Project, get_new_session, destroy_session


session = get_new_session()
project = Project(project_name="test_project")
session.add(project)
session.commit()
destroy_session(session)
print("Done")