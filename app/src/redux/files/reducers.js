import _ from 'lodash';

import { 
	RENEW_TOTAL_AMOUNT
} from './actions.js'


const defaultState = {
	"amount": 0,
	"loaded": false
}


function renew_total_amount(state = defaultState, action) {
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
				case RENEW_TOTAL_AMOUNT:
					return renew_total_amount(state, action);
				default:
					return state;
			}
		}
	}
}


export default file_reduce
