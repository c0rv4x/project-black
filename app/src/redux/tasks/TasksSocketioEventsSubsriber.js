import Notifications from 'react-notification-system-redux'

import { 
	renewTasks,
	updateTasks,

	tasksCreated
} from './actions';

import Connector from '../SocketConnector.jsx';
import TasksSocketioEventsEmitter from './TasksSocketioEventsEmitter.js';


let instance = null;

class TasksSocketioEventsSubsriber {
	/* Singleton class for managing events subscription for the tasks */
	constructor(store, project_uuid) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('tasks');

        this.connector.after_connected((x) => {
        	this.emitter = new TasksSocketioEventsEmitter();
        	this.emitter.requestRenewTasks(this.project_uuid, true);
        });

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all tasks in one message
		this.register_socketio_handler('tasks:all:get:back:all', renewTasks);
		this.register_socketio_handler('tasks:all:get:back:updated', updateTasks);
		this.register_socketio_handler('tasks:new', tasksCreated);
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
