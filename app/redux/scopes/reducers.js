import _ from 'lodash';

import { 
	CREATE_SCOPE, 
	DELETE_SCOPE
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

function scope_reduce(state = initialState, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}

	else {
		if (action.message && action.current_project_uuid != action.message.project_uuid) { return state; }
		else {
			switch (action.type) {
				case CREATE_SCOPE:
					return create_scope(state, action);
				case DELETE_SCOPE:
					return delete_scope(state, action);
				default:
					return state;
			}
		}
	}
}



export default scope_reduce
