import Connector from '../SocketConnector.jsx';


class ProjectsSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the projects */
	constructor() {
        this.connector = new Connector('projects');
	}

	requestCreateProject(project_name) {
		this.connector.emit('projects:create', {
			'project_name': project_name
		});
	}

	requestDeleteProject(project_uuid) {
		this.connector.emit('projects:delete:project_uuid', {
			'project_uuid': project_uuid
		});
	}

	requestUpdateProject(project_uuid, project_name, comment) {
		this.connector.emit('projects:update', {
			'project_uuid': project_uuid,
			'project_name': project_name,
			'comment': comment
		});
	}

	requestRenewProjects() {
		this.connector.emit('projects:all:get');
	}

}

export default ProjectsSocketioEventsEmitter;
