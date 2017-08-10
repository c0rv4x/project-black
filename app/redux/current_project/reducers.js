import _ from 'lodash';

import { 
	RENEW_CURRENT_PROJECT
} from './actions.js'


function renew_current_project(state = {}, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		return message['current_project'];
	} else {
		/* TODO: add error handling */
	}		
}

function current_project_reduce(state = {}, action) {
	switch (action.type) {
		case RENEW_CURRENT_PROJECT:
			return renew_current_project(state, action);
		default:
			return state;
	}
}


export default current_project_reduce
