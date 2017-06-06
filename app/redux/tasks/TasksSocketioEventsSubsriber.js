import { 
	newTask, 
	changeStatusTask,
	renewTasks
} from './actions';

import Connector from '../SocketConnector.jsx';
import TasksSocketioEventsEmitter from './TasksSocketioEventsEmitter.js';


let instance = null;

class TasksSocketioEventsSubsriber {
	/* Singleton class for managing events subscription for the tasks */
	constructor(store) {
        this.store = store;
        this.connector = new Connector('tasks');

        this.connector.after_connected((x) => {
        	this.emitter = new TasksSocketioEventsEmitter();
        	this.emitter.requestRenewTasks();
        });

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all tasks in one message
		this.register_socketio_handler('tasks:all:get:back', renewTasks);
		this.register_project_new_task();
		this.register_project_delete_task();
	}

	register_project_new_task() {
		/* Check new task */
		this.register_socketio_handler('tasks:new', newTask);
	}

	register_project_delete_task() {
		/* Check deleted task */
		this.register_socketio_handler('tasks:status_change', changeStatusTask);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x));
		});
	}
}

export default TasksSocketioEventsSubsriber;
