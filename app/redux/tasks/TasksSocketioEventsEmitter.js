import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


class TasksSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the tasks */
	constructor() {
        this.connector = new Connector('tasks');
	}

	requestCreateTask(task_type, filters, params, project_uuid) {
		this.connector.emit('tasks:create', {
			"task_type": task_type,
			"filters": filters,
			"params": params,
			"project_uuid": project_uuid
		});
	}

	requestChangeStatusTask(task_id) {
		this.connector.emit('tasks:status_change:task_id', {
			'task_id': task_id
		});
	}

	requestRenewTasks(project_uuid) {
		this.connector.emit('tasks:all:get', {
			'project_uuid': project_uuid
		});
	}

}

export default TasksSocketioEventsEmitter;
