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

		new_state.ips.data = new_ips.concat(new_state.ips.data).slice(0, new_state.ips.page_size);
		new_state.ips.total_db_ips += new_ips.length;

		new_state.hosts.data = new_hosts.concat(new_state.hosts.data).slice(0, new_state.hosts.page_size);
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
	return state;
}

function update_scope(state = initialState, action) {
	const message = action.message;

	if (message["status"] == "success") {
		var { scope_id, scope_type, comment } = message;

		if (scope_type == 'ip_address') {
			for (var each_ip of state.ips.data) {
				if (each_ip.ip_id == scope_id) {
					var new_state = JSON.parse(JSON.stringify(state));

					for (var each_new_ip of new_state.ips.data) {
						if (each_new_ip.ip_id == scope_id) {
							each_new_ip.comment = comment;
							break;
						}
					}

					return new_state;
				}
			}
		} else {
			for (var each_host of state.hosts.data) {
				if (each_host.host_id == scope_id) {
					var new_state = JSON.parse(JSON.stringify(state));

					for (var each_new_host of new_state.hosts.data) {
						if (each_new_host.host_id == scope_id) {
							each_new_host.comment = comment;
							break;
						}
					}

					return new_state;
				}
			}
		}

		return state;
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
