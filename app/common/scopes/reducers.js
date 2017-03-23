import _ from 'lodash';

import { 
	CREATE_SCOPE, 
	DELETE_SCOPE, 
	UPDATE_COMMENT, 
	RENEW_SCOPES 
} from './actions.js'


const initialState = {
	scopes: []
}

function create_scope(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		return state.concat(_.map(message["new_scopes"], (x) => {
			return {
				"project_uuid": message["project_uuid"],
				"scope_id": x["scope_id"],
				"hostname": x["hostname"],
				"ip_address": x["ip_address"],
				"comment": x["comment"]
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
			return x["scope_id"] != message["scope_id"];
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

function update_comment(state = [], action) {
	const scope_id = action.message['scope_id'];
	const new_comment = action.message['comment'];

	var new_state = state.slice();
	for (var scope of new_state) {
		if (scope.scope_id == scope_id) {
			scope.comment = new_comment;
		}
		else continue
	}

	return new_state;
}

function scope_reduce(state = [], action) {
	switch (action.type) {
		case CREATE_SCOPE:
			return create_scope(state, action);
		case DELETE_SCOPE:
			return delete_scope(state, action);
		case RENEW_SCOPES:
			return renew_scopes(state, action);
		case UPDATE_COMMENT:
			return update_comment(state, action);
		default:
			return state;
	}
}



export default scope_reduce