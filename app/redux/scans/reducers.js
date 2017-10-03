import _ from 'lodash';

import { 
	RENEW_SCANS
} from './actions.js'


function renew_scans(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		console.log("renew_scans", message.scans.length);
		return message['scans'];
	} else {
		/* TODO: add error handling */
	}
}

function scan_reduce(state = [], action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {
		if (action.current_project_uuid !== action.message.project_uuid) { 
			console.log(action);
		console.log("Not corret uuid");
			return state; }
		else {	
			switch (action.type) {
				case RENEW_SCANS:
					return renew_scans(state, action);
				default:
					return state;
			}
		}
	}
}


export default scan_reduce
