import _ from 'lodash';

import { 
	UPDATE_FILTERS
} from './actions.js'


const initialState = {
	"ips": {},
	"hosts": {}
};

function update_filters(state = initialState, action) {
	const message = action.message;
	var newState = {};

	if (message.hasOwnProperty('hosts')) {
		newState['hosts'] = message['hosts'];
	}
	else {
		newState['hosts'] = {};
	}
	if (message.hasOwnProperty('ips')) {
		newState['ips'] = message['ips'];
	}
	else {
		newState['ips'] = {};
	}

	return newState;
}

function filter_reduce(state = initialState, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {	
		switch (action.type) {
			case UPDATE_FILTERS:
				return update_filters(state, action);
			default:
				return state;
		}
	}
}


export default filter_reduce
