import _ from 'lodash';

import { 
	CREATE_SCOPE, 
	DELETE_SCOPE, 
	RENEW_SCOPES,
	CLEAR_SCOPES,
	UPDATE_COMMENT,
	UPDATE_SCOPE
} from './actions.js'


const initialState = {
	"ips": {
		"page": 0,
		"page_size": 12,
		"data": []
	},
	"hosts": {
		"page": 0,
		"page_size": 12,
		"data": []
	},
	"update_needed": false
}

function create_scope(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		let new_state = JSON.parse(JSON.stringify(state));
		let new_ips = [];
		let new_hosts = [];

		for (var each_scope of message.new_scopes) {
			if (each_scope.type == "ip_address") {
				new_ips.push(each_scope);
			}
			else {
				new_hosts.push(each_scope);
			}
		}

		new_state.ips.data = new_ips.concat(new_state.ips.data);
		new_state.ips.total_db_ips += new_ips.length;

		new_state.hosts.data = new_hosts.concat(new_state.hosts.data);
		new_state.hosts.total_db_hosts += new_hosts.length;

		new_state.update_needed = false;			

		return new_state;
	} else {
		/* TODO: add error handling */
	}
}

function delete_scope(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var new_state = JSON.parse(JSON.stringify(state));
		new_state.update_needed = true;

		return new_state;
	} else {
		/* TODO: add error handling */
	}
}

function renew_scopes(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		return {
			'ips': message.ips,
			'hosts': message.hosts,
			'update_needed': false
		}
	} else {
		/* TODO: add error handling */
	}		
}

function clear_scopes(state = initialState, action) {
	return initialState;
}

function update_comment(state = initialState, action) {
	const _id = action.message.updated_scope['_id'];
	const new_comment = action.message.updated_scope['comment'];

	var new_state = JSON.parse(JSON.stringify(state));

	for (var scope of new_state['ips']) {
		if (scope._id == _id) {
			scope.comment = new_comment;

			return new_state;
		}
	}
	for (var scope of new_state['hosts']) {
		if (scope._id == _id) {
			scope.comment = new_comment;

			return new_state;
		}
	}

	return state;
}

function update_scope(state = initialState, action) {
	const message = action.message;

	if (message["status"] == "success") {
		var new_state = JSON.parse(JSON.stringify(state));
		var updated_scope = message["updated_scope"];

		if (updated_scope["type"] == "ip") {
			for (var ip_addr of new_state["ips"]) {
				if (ip_addr["_id"] == updated_scope["_id"]) {
					ip_addr["comment"] = updated_scope["comment"]
					break;
				}
			}
		}
		else if (updated_scope["type"] == "host") {
			for (var host of new_state["hosts"]) {
				if (host["_id"] == updated_scope["_id"]) {
					host["comment"] = updated_scope["comment"]
					break;
				}
			}
		}

		return new_state;
	} else {
		console.error(message);
		/* TODO: add error handling */
	}

}

function scope_reduce(state = initialState, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}

	else {
		if (action.message && action.current_project_uuid !== action.message.project_uuid) { return state; }
		else {
			switch (action.type) {
				case CREATE_SCOPE:
					return create_scope(state, action);
				case DELETE_SCOPE:
					return delete_scope(state, action);
				case RENEW_SCOPES:
					return renew_scopes(state, action);
				case CLEAR_SCOPES:
					return clear_scopes(state, action);
				case UPDATE_COMMENT:
					return update_comment(state, action);
				case UPDATE_SCOPE:
					return update_scope(state, action);
				default:
					return state;
			}
		}
	}
}



export default scope_reduce
