import {
	NEW_TASK,
	CHANGE_STATUS_TASK,
	RENEW_TASKS
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
		return { 
			'active': message['tasks'][0],
			'finished': message['tasks'][1]
		};
	} else {
		/* TODO: add error handling */
	}	
	return state;
}

function task_reduce(state = {'active': [], 'finished': []}, action) {
	switch (action.type) {
		case NEW_TASK:
			return new_task(state, action);
		case CHANGE_STATUS_TASK:
			return change_status_task(state, action);
		case RENEW_TASKS:
			return renew_tasks(state, action);
		default:
			return state;
	}
}



export default task_reduce