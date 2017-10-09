import Notifications from 'react-notification-system-redux'

import { 
	createProject, 
	deleteProject,
	renewProjects,
	updateProject
} from './actions';

import Connector from '../SocketConnector.jsx';
import ProjectsSocketioEventsEmitter from './ProjectsSocketioEventsEmitter.js';


class ProjectsSocketioEventsSubscriber {
	/* Class for managing events subscription for the projects */
	constructor(store) {
        this.store = store;
        this.connector = new Connector('projects');

        this.connector.after_connected((x) => {
        	this.emitter = new ProjectsSocketioEventsEmitter();
        	this.emitter.requestRenewProjects();
        });

        this.basic_events_registration();
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
			if (x.status == 'success') {
				this.store.dispatch(callback(x));
			}
			else {
				this.store.dispatch(Notifications.error({
					title: 'Error with project',
					message: x.text
				}));
			}
		});
	}

    close() {
        this.connector.close();
    }	
}

export default ProjectsSocketioEventsSubscriber;
