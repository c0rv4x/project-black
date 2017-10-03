import _ from 'lodash';

import { 
	CREATE_SCOPE, 
	DELETE_SCOPE, 
	RENEW_SCOPES,
	UPDATE_COMMENT,
	UPDATE_SCOPE
} from './actions.js'


const initialState = {
	"ips": [],
	"hosts": []
}

function create_scope(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var new_state = JSON.parse(JSON.stringify(state));

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
				"ip_addresses": [],
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
		var ips_filtered = _.filter(state['ips'], (x) => {
			return x["_id"] != message["_id"];
		});
		var hosts_filtered = _.filter(state['hosts'], (x) => {
			return x["_id"] != message["_id"];
		});

		var state_new = {
			'ips': ips_filtered,
			'hosts': hosts_filtered
		}

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
	if (action.current_project_uuid !== action.message.project_uuid) { return state; }
	else {
		switch (action.type) {
			case CREATE_SCOPE:
				return create_scope(state, action);
			case DELETE_SCOPE:
				return delete_scope(state, action);
			case RENEW_SCOPES:
				return renew_scopes(state, action);
			case UPDATE_COMMENT:
				return update_comment(state, action);
			case UPDATE_SCOPE:
				return update_scope(state, action);
			default:
				return state;
		}
	}
}



export default scope_reduce
