import _ from 'lodash';

import { 
	RECEIVE_CREDS
} from './actions.js'

const initialState = {
	"current_values": []
};

function receiveCreds(state = initialState, action) {
	// TODO: if there are creds on both ips and hosts
	// we turn up in a situation when there are no creds displayed:
	//   1. Fetch ips and creds for ips
	//   2. Fetch hosts and creds for hosts
	//   3. ips creds are replaced with hosts creds

	return {
		current_values: action.creds
	}
}

function creds_reduce(state = initialState, action) {
	switch (action.type) {
		case RECEIVE_CREDS:
			return receiveCreds(state, action);
		default:
			return state;
	}
}


export default creds_reduce
