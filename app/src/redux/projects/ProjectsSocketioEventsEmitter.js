import Connector from '../SocketConnector.jsx';


class ProjectsSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the projects */
	constructor() {
        this.connector = new Connector('projects');
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

}

export default ProjectsSocketioEventsEmitter;
