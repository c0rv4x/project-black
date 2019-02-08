import _ from 'lodash';

import { 
	RECEIVE_CREDS
} from './actions.js'

const initialState = {
	"current_values": []
};

function receiveCreds(state = initialState, action) {
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
