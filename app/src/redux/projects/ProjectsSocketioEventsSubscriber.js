import { 
	fetchProjects
} from './actions';

import Connector from '../SocketConnector.jsx';


class ProjectsSocketioEventsSubscriber {
	/* Class for managing events subscription for the projects */
	constructor(store) {
        this.store = store;
		this.connector = new Connector('projects');

		this.register_socketio_handler('project:created', fetchProjects);
		this.register_socketio_handler('project:deleted', fetchProjects);
		this.register_socketio_handler('project:updated', fetchProjects);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x));
		});
	}

    close() {
        this.connector.close();
    }	
}

export default ProjectsSocketioEventsSubscriber;
