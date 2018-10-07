import _ from 'lodash';

import { 
	RENEW_TOTAL_AMOUNT,
	ADD_NEW_STATS
} from './actions.js'


// TODO: the loaded variable should be named something like 
// 'total_amount_loaded' or something similar
const defaultState = {
	"stats": {},
	"amount": 0,
	"loaded": false
}


function renew_total_amount(state = defaultState, action) {
	const message = action.message;

	return {
		"stats": state['stats'],
		"amount": message['amount'],
		"loaded": true
	};
}

function add_new_stats(state = defaultState, action) {
	const message = action.message;

	// TODO: merge message['stats'] with the previous state
	// This can help if we need to reload statsics on a single file
	return {
		"stats": message['stats'],
		"amount": state['amount'],
		"loaded": state['loaded']
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
				case RENEW_TOTAL_AMOUNT:
					return renew_total_amount(state, action);
				case ADD_NEW_STATS:
					return add_new_stats(state, action);
				default:
					return state;
			}
		}
	}
}


export default file_reduce
