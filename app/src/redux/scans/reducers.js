import _ from 'lodash';

import { 
	RENEW_SCANS_STATS,
	SET_LOADING_SCANS
} from './actions.js'


const defaultState = {
	"amount": 0,
	"loaded": false
}

function renewScansStats(state = defaultState, action) {
	return {
		"amount": action.amount,
		...state
	};
}

function setLoadingScans(state = defaultState, action) {
	return {
		"loaded": !action.loading,
		...state
	};
}

function scan_reduce(state = defaultState, action) {
	switch (action.type) {
		case RENEW_SCANS_STATS:
			return renewScansStats(state, action);
		case SET_LOADING_SCANS:
			return setLoadingScans(state, action);
		default:
			return state;
	}
}


export default scan_reduce
