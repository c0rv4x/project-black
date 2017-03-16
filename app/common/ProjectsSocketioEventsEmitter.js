import Connector from './SocketConnector.jsx';


let instance = null;

class ProjectsSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the projects */
	constructor() {
        if(!instance){
            instance = this;

            this.connector = new Connector();

        }

        return instance;
	}

	createProject(project_name) {
		this.connector.emit('projects:create', {
			'project_name': project_name
		});
	}

	deleteProject(project_uuid) {
		this.connector.emit('projects:delete:project_uuid', {
			'project_uuid': project_uuid
		});
	}

	updateProjects(project_uuid, project_name, comment) {
		this.connector.emit('projects:update', {
			'project_uuid': project_uuid,
			'project_name': project_name,
			'comment': comment
		});
	}

	renewProjects() {
		this.connector.emit('projects:all:get');
	}

}

export default ProjectsSocketioEventsEmitter;