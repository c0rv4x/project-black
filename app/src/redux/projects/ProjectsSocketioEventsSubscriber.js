import { 
	fetchProjects
} from './actions';

import Connector from '../SocketConnector.jsx';


class ProjectsSocketioEventsSubscriber {
	/* Class for managing events subscription for the projects */
	constructor(store) {
        this.store = store;
		this.connector = new Connector('projects');

		this.register_socketio_handler('projects:updated', fetchProjects);
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
