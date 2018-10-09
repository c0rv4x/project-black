import _ from 'lodash';

import { 
	SET_DICTS
} from './actions.js'

const default_value = {
	"amount": 0,
	"dicts": []
};

// function renew_stats(state=default_value, action) {
// 	const message = action.message;

// 	return {
// 		"amount": message["amount"],
// 		"current_value": state["current_values"]
// 	}
// }

function set_dicts(state=default_value, action) {
	const message = action.message;

    return {
		"amount": state["amount"],
		"dicts": message["dicts"]
	}
}

function dicts_reduce(state=default_value, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {
		if (action.message && action.current_project_uuid != action.message.project_uuid) { return state; }
		else {	
			switch (action.type) {
				// case RENEW_CREDS_STATS:
                //     return renew_stats(state, action);
                case SET_DICTS:
					return set_dicts(state, action);                    
				default:
					return state;
			}
		}
	}
}


export default dicts_reduce
