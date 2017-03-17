import {
	NEW_TASK,
	CHANGE_STATUS_TASK,
	RENEW_TASKS
} from './actions';


function start_task(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {

	} else {
		/* TODO: add error handling */
	}	

	return state;
}


function change_status_task(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		
	} else {
		/* TODO: add error handling */
	}	
	return state;
}


function renew_tasks(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		
	} else {
		/* TODO: add error handling */
	}	
	return state;
}

function task_reduce(state = [], action) {
	switch (action.type) {
		case NEW_TASK:
			return start_task(state, action);
		case CHANGE_STATUS_TASK:
			return change_status_task(state, action);
		case RENEW_TASKS:
			return renew_tasks(state, action);
		default:
			return state;
	}
}



export default task_reduce