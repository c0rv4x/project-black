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
	console.log(message);

	if (message["status"] == 'success') {
		return state.concat(_.map(message["new_scopes"], (x) => {
			return {
				"project_uuid": message["project_uuid"],
				"new_scopes": x
			}
		}));
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
		return message['scopes'];
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