import _ from 'lodash';

import { 
	RENEW_SCANS_STATS
} from './actions.js'


function renew_scans_stats(state = {}, action) {
	const message = action.message;

	return {
		"amount": message['amount']
	};
}

function scan_reduce(state = {}, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {
		if (action.message && action.current_project_uuid != action.message.project_uuid) { 
			return state;
		}
		else {	
			switch (action.type) {
				case RENEW_SCANS_STATS:
					return renew_scans_stats(state, action);
				default:
					return state;
			}
		}
	}
}


export default scan_reduce
