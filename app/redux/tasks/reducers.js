import {
	NEW_TASK,
	CHANGE_STATUS_TASK,
	RENEW_TASKS,
	UPDATE_TASKS
} from './actions';


function new_task(state = {'active': [], 'finished': []}, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		let active_tasks = Object.assign([], state['active'], null);
		active_tasks.push(message['new_task']);

		return {
			'active': active_tasks,
			'finished': state['finished']
		}
	} else {
		/* TODO: add error handling */
	}	

	return state;
}


function change_status_task(state = {'active': [], 'finished': []}, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		
	} else {
		/* TODO: add error handling */
	}	
	return state;
}


function renew_tasks(state = {'active': [], 'finished': []}, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		const active_tasks = message['tasks']['active'];
		var parsed_active_tasks = _.map(_.uniq(active_tasks), (x) => {
			return {
				"task_id": x["task_id"],
				"task_type": x["task_type"],
				"params": x["params"],
				"target": x["target"],
				"status": x["status"],
				"progress": x["progress"],
				"project_uuid": x["project_uuid"],
				"text": x["text"],
				"stdout": x["stdout"],
				"stderr": x["stderr"],
				"date_added": x["date_added"]
			}
		});

		const finished_tasks = message['tasks']['finished'];
		var parsed_finished_tasks = _.map(_.uniq(finished_tasks), (x) => {
			return {
				"task_id": x["task_id"],
				"task_type": x["task_type"],
				"params": x["params"],
				"target": x["target"],
				"status": x["status"],
				"progress": x["progress"],
				"project_uuid": x["project_uuid"],
				"text": x["text"],
				"stdout": x["stdout"],
				"stderr": x["stderr"],
				"date_added": x["date_added"]
			}
		});

		return {
			'active': parsed_active_tasks,
			'finished': parsed_finished_tasks
		};
	} else {
		/* TODO: add error handling */
	}	
	return state;
}

function update_tasks(state = {'active': [], 'finished': []}, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		const active_tasks = message['tasks']['active'];
		var updated_active_task_ids = [];

		var parsed_active_tasks = _.map(active_tasks, (x) => {
			updated_active_task_ids.push(x["task_id"]);

			return {
				"task_id": x["task_id"],
				"task_type": x["task_type"],
				"params": x["params"],
				"target": x["target"],
				"status": x["status"],
				"progress": x["progress"],
				"project_uuid": x["project_uuid"],
				"text": x["text"],
				"stdout": x["stdout"],
				"stderr": x["stderr"],
				"date_added": x["date_added"]
			}
		});

		const finished_tasks = message['tasks']['finished'];
		var updated_finished_task_ids = [];

		var parsed_finished_tasks = _.map(finished_tasks, (x) => {
			updated_finished_task_ids.push(x["task_id"]);

			return {
				"task_id": x["task_id"],
				"task_type": x["task_type"],
				"params": x["params"],
				"target": x["target"],
				"status": x["status"],
				"progress": x["progress"],
				"project_uuid": x["project_uuid"],
				"text": x["text"],
				"stdout": x["stdout"],
				"stderr": x["stderr"],
				"date_added": x["date_added"]
			}
		});

		var filtered_active_tasks = state.active.filter((x) => {
			return ((updated_active_task_ids.indexOf(x.task_id) === -1) && 
				(updated_finished_task_ids.indexOf(x.task_id) === -1));
		});

		return { 
			'active': parsed_active_tasks.concat(filtered_active_tasks),
			'finished': parsed_finished_tasks.concat(state.finished)
		};
	} else {
		/* TODO: add error handling */
	}	
}

function task_reduce(state = {'active': [], 'finished': []}, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {
		if (action.type == RENEW_TASKS) {
			console.log(action);
		}
		if (action.current_project_uuid !== action.message.project_uuid) { return state; }
		else {		
			switch (action.type) {
				case NEW_TASK:
					return new_task(state, action);
				case CHANGE_STATUS_TASK:
					return change_status_task(state, action);
				case RENEW_TASKS:
					return renew_tasks(state, action);
				case UPDATE_TASKS:
					return update_tasks(state, action);			
				default:
					return state;
			}
		}
	}
}

export default task_reduce
