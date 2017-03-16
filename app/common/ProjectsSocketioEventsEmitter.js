import Connector from './SocketConnector.jsx';


let instance = null;

class ProjectsSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the projects */
	constructor(store) {
        if(!instance){
            instance = this;

            this.store = store;
            this.connector = new Connector();

        }

        return instance;
	}

	create_project(project_name) {
		this.connector.emit('projects:create', {
			'project_name': project_name
		});
	}

	delete_project(project_uuid) {
		this.connector.emit('projects:delete:project_uuid', {
			'project_uuid': project_uuid
		});
	}

	update_projects(project_uuid, project_name, comment) {
		this.connector.emit('projects:update', {
			'project_uuid': project_uuid,
			'project_name': project_name,
			'comment': comment
		});
	}

	renew_projects() {
		this.connector.emit('projects:all:get');
	}

}

export default ProjectsSocketioEventsEmitter;