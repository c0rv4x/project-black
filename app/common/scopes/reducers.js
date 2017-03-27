import _ from 'lodash';

import { 
	CREATE_SCOPE, 
	DELETE_SCOPE, 
	UPDATE_COMMENT, 
	RENEW_SCOPES,
	UPDATE_SCOPES
} from './actions.js'


const initialState = {
	"ips": [],
	"hosts": []
}

function create_scope(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var new_state = Object.assign({}, state, null);

		var new_ips = _.filter(message["new_scopes"], (x) => {
			return x['type'] == 'ip';
		})
		new_state['ips'] = new_state['ips'].concat(_.map(new_ips, (x) => {
			return {
				"_id": x["_id"],
				"ip_address": x["ip_address"],
				"hostnames": x["hostnames"],
				"comment": x["comment"],
				"project_uuid": message["project_uuid"]
			}
		}));


		var new_hosts = _.filter(message["new_scopes"], (x) => {
			return x['type'] == 'host';
		})
		new_state['hosts'] = new_state['hosts'].concat(_.map(new_hosts, (x) => {
			return {
				"_id": x["_id"],
				"hostname": x["hostname"],
				"comment": x["comment"],
				"project_uuid": message["project_uuid"]
			}
		}))

		return new_state;
	} else {
		/* TODO: add error handling */
	}
}

function delete_scope(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = state.slice();

		var scopes_filtered = _.filter(state_new, (x) => {
			return x["_id"] != message["_id"];
		});
		state_new = scopes_filtered;

		return state_new;
	} else {
		/* TODO: add error handling */
	}
}

function renew_scopes(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		return {
			'ips': message['ips'],
			'hosts': message['hosts']
		}
	} else {
		/* TODO: add error handling */
	}		
}

function update_comment(state = initialState, action) {
	const _id = action.message['_id'];
	const new_comment = action.message['comment'];

	var new_state = state.slice();
	for (var scope of new_state) {
		if (scope._id == _id) {
			scope.comment = new_comment;
		}
		else continue
	}

	return new_state;
}

function update_scopes(state = initialState, action) {
	const message = action.message;

	if (message["status"] == "success") {
		var new_state = state.slice();
		var updated_scopes = message["updated_scopes"];
		var ids_to_update = Object.keys(updated_scopes);

		for (var scope of state) {
			if (ids_to_update.indexOf(scope["_id"]) !== -1) {
				var target_id = scope["_id"];

				scope.comment = updated_scopes[target_id]["comment"];
			}
		}

		return state

	} else {
		/* TODO: add error handling */
	}

}

function scope_reduce(state = initialState, action) {
	switch (action.type) {
		case CREATE_SCOPE:
			return create_scope(state, action);
		case DELETE_SCOPE:
			return delete_scope(state, action);
		case RENEW_SCOPES:
			return renew_scopes(state, action);
		case UPDATE_COMMENT:
			return update_comment(state, action);
		case UPDATE_SCOPES:
			return update_scopes(state, action);
		default:
			return state;
	}
}



export default scope_reduce