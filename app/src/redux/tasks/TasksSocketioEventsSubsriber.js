
import { 
	receiveTasksUpdate,

	tasksCreated
} from './actions';

import Connector from '../SocketConnector.jsx';


let instance = null;

class TasksSocketioEventsSubsriber {
	/* Singleton class for managing events subscription for the tasks */
	constructor(store, project_uuid) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('tasks');

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all tasks in one message
		this.register_socketio_handler('tasks:new', tasksCreated);

		this.register_socketio_handler('tasks:all:get:back:updated', receiveTasksUpdate);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x, this.project_uuid));
		});
	}

    close() {
        this.connector.close();
    }	
}

export default TasksSocketioEventsSubsriber;
