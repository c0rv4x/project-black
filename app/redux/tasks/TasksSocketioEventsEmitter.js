import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


class TasksSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the tasks */
	constructor() {
        this.connector = new Connector();
	}

	requestCreateTask(task_type, target, params, project_uuid) {
		this.connector.emit('tasks:create', {
			"task_type": task_type,
			"target": target,
			"params": params,
			"project_uuid": project_uuid
		});
	}

	requestChangeStatusTask(task_id) {
		this.connector.emit('tasks:status_change:task_id', {
			'task_id': task_id
		});
	}

	requestRenewTasks() {
		this.connector.emit('tasks:all:get');
	}

}

export default TasksSocketioEventsEmitter;
