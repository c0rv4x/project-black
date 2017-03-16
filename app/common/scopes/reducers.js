import _ from 'lodash';

import { 
	CREATE_SCOPE, 
	DELETE_SCOPE, 
	UPDATE_SCOPE, 
	RENEW_SCOPES 
} from './actions.js'


const initialState = {
	scopes: []
}

function create_scope(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = state.slice();

		state_new.push({
			"scope_name": message["new_scope"]["scope_name"],
			"scope_uuid": message["new_scope"]["scope_uuid"],
			"comment": message["new_scope"]["comment"]
		});

		return state_new;
	} else {
		/* TODO: add error handling */
	}
}

function delete_scope(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = state.slice();

		var scopes_filtered = _.filter(state_new, (x) => {
			return x["scope_uuid"] != message["scope_uuid"];
		});
		state_new = scopes_filtered;

		return state_new;
	} else {
		/* TODO: add error handling */
	}
}

function renew_scopes(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = message['scopes'];
		console.log('doing many scopes');

		return state_new;
	} else {
		/* TODO: add error handling */
	}		
}

function scope_reduce(state = [], action) {
	switch (action.type) {
		case CREATE_SCOPE:
			return create_scope(state, action);
		case DELETE_SCOPE:
			return delete_scope(state, action);
		case RENEW_SCOPES:
			return renew_scopes(state, action);
		default:
			return state;
	}
}



export default scope_reduce