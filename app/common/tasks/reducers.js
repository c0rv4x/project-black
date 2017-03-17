import {
	START_TASK,
	STOP_TASK,
	RENEW_TASKS
} from './actions';


function create_task(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {

	} else {
		/* TODO: add error handling */
	}	

	return state;
}


function delete_task(state = [], action) {
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
		case CREATE_SCOPE:
			return create_task(state, action);
		case DELETE_SCOPE:
			return delete_task(state, action);
		case RENEW_SCOPES:
			return renew_tasks(state, action);
		default:
			return state;
	}
}



export default task_reduce