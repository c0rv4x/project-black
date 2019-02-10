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

	requestRenewTasks(project_uuid, send_all) {
		if (!send_all) { send_all = false }
		this.connector.emit('tasks:all:get', {
			'project_uuid': project_uuid,
			'send_all': send_all
		});
	}

}

export default TasksSocketioEventsEmitter;
