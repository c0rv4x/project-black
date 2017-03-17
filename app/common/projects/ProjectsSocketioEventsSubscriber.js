import { 
	createProject, 
	deleteProject,
	renewProjects,
	updateProject
} from './actions';

import Connector from '../SocketConnector.jsx';
import ProjectsSocketioEventsEmitter from './ProjectsSocketioEventsEmitter.js';

let instance = null;

class ProjectsEventsSubsriber {
	/* Singleton class for managing events subscription for the projects */
	constructor(store) {
        if(!instance){
            instance = this;

            this.store = store;
            this.connector = new Connector();

            this.connector.after_connected((x) => {
            	this.emitter = new ProjectsSocketioEventsEmitter();
            	this.emitter.renewProjects();
            });

            this.basic_events_registration();
        }

        return instance;
	}

	basic_events_registration() {
		/* Register handlers on basic events */

		// Received all projects in one message
		this.register_socketio_handler('projects:all:get:back', renewProjects);

		// Backend tried to create a new project (both: successfully and not successfully)
		this.register_socketio_handler('projects:create', createProject);

		// Backend tried to delete a project (both: successfully and not successfully)
		this.register_socketio_handler('projects:delete', deleteProject);

		// Backend tried to update a project (both: successfully and not successfully)
		this.register_socketio_handler('projects:update', updateProject);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x));
		});
	}
}

export default ProjectsEventsSubsriber;