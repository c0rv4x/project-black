import _ from 'lodash';

import { 
	DELETED_CREDS,
	RENEW_CREDS,
	RENEW_CREDS_STATS
} from './actions.js'

const default_value = {
	"amount": 0,
	"current_values": [],
	"update_needed": false
};

function renew_stats(state=default_value, action) {
	const message = action.message;

	return {
		"amount": message["amount"],
		"current_value": state["current_values"],
		"update_needed": false
	}
}

function renew_creds(state=default_value, action) {
	const message = action.message;

	return {
		"amount": state["amount"],
		"current_values": message["creds"],
		"update_needed": false
	}
}

function deleted_creds(state=default_value, action) {
	return {
		"amount": state["amount"],
		"current_values": state["current_values"],
		"update_needed": true
	}	
}

function creds_reduce(state=default_value, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {
		if (action.message && action.current_project_uuid != action.message.project_uuid) { return state; }
		else {	
			switch (action.type) {
				case RENEW_CREDS_STATS:
                    return renew_stats(state, action);
                case RENEW_CREDS:
					return renew_creds(state, action);
				case DELETED_CREDS:
					return deleted_creds(state, action);
				default:
					return state;
			}
		}
	}
}


export default creds_reduce
