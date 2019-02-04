import { 
	fetchProjects,
	updateProject
} from './actions';

import Connector from '../SocketConnector.jsx';
import ProjectsSocketioEventsEmitter from './ProjectsSocketioEventsEmitter.js';


class ProjectsSocketioEventsSubscriber {
	/* Class for managing events subscription for the projects */
	constructor(store) {
        this.store = store;
        this.connector = new Connector('projects');

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */

		this.register_socketio_handler('projects:updated', fetchProjects);

		// Backend tried to update a project (both: successfully and not successfully)
		this.register_socketio_handler('projects:update', updateProject);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			if (x.status == 'success') {
				this.store.dispatch(callback(x));
			}
		});
	}

    close() {
        this.connector.close();
    }	
}

export default ProjectsSocketioEventsSubscriber;
