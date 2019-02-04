import Connector from '../SocketConnector.jsx';


class ProjectsSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the projects */
	constructor() {
        this.connector = new Connector('projects');
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

	requestUpdateIpsLock(project_uuid, value) {
		this.connector.emit('projects:update', {
			'project_uuid': project_uuid,
			'ips_locked': value
		});		
	}

	requestUpdateHostsLock(project_uuid, value) {
		this.connector.emit('projects:update', {
			'project_uuid': project_uuid,
			'hosts_locked': value
		});		
	}

	requestRenewProjects() {
		this.connector.emit('projects:all:get');
	}

}

export default ProjectsSocketioEventsEmitter;
