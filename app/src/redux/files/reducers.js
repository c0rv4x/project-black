import _ from 'lodash';

import { 
	RENEW_FILES_STATS
} from './actions.js'


const defaultState = {
	"amount": 0,
	"loaded": false
}


function renew_stats(state = defaultState, action) {
	const message = action.message;

	return {
		"amount": message['amount'],
		"loaded": true
};
}

function file_reduce(state = defaultState, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {	
		if (action.message && action.current_project_uuid != action.message.project_uuid) { return state; }
		else {	
			switch (action.type) {
				case RENEW_FILES_STATS:
					return renew_stats(state, action);
				default:
					return state;
			}
		}
	}
}


export default file_reduce
