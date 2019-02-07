import _ from 'lodash';

import { 
	UPDATED_IPS,
	RESOLVE_HOSTS,
	HOST_DATA_UPDATED,
	GET_TASKS_BY_HOSTS,
	SET_LOADED_HOSTS,

	SET_LOADING_HOSTS,
	RECEIVE_HOSTS,
	HOST_COMMENT_UPDATED,
	FLUSH_HOSTS
} from './actions.js'


const initialState = {
	"loaded": false,
	"page": 0,
	"page_size": 12,
	"resolve_finished": false,
	"total_db_hosts": 0,
	"selected_hosts": 0,
	"data": [],
	"tasks": {
		"active": [],
		"finished": []
	}
}


function host_data_updated(state = initialState, action) {
	const message = action.message;

	var found = false;

	if (message.updated_hosts) {
		for (var each_host of message.updated_hosts) {
			for (var state_host of state.data) {
				if (state_host.hostname == each_host) {
					console.log("Got some files for currently displayed hosts");
					found = true;
					break;
				}
			}
		}
	}
	else if (message.updated_hostname) {
		for (var state_ip of state.data) {
			if (state_ip.hostname == message.updated_hostname) {
				found = true;
				break;
			}
		}
	} else {
		found = true;
	}


	if (found) {
		return {
			...state
		};
	}
	else {
		return state;
	}
}

function updated_ips(state = initialState, action) {
	const message = action.message;

	var found = false;

	if (message.updated_ips) {
		for (var each_id of message.updated_ips) {
			for (var state_host of state.data) {
				for (var state_ip of state_host.ip_addresses) {
					if (state_ip.ip_id == each_id) {
						found = true;
						break;
					}
				}
			}
			if (found) break;
		}
	}

	if (found) {
		return {
			...state
		};
	}
	else {
		return state;
	}
}

function resolve_hosts(state = initialState, action) {
	return {
		...state,
		resolve_finished: true
	};
}


function get_tasks_by_hosts(state = initialState, action) {
	const message = action.message;
	const active_tasks = message['active'];

	var parsed_active_tasks = _.map(active_tasks, (x) => {
		return {
			"task_id": x["task_id"],
			"task_type": x["task_type"],
			"params": x["params"],
			"target": x["target"],
			"status": x["status"],
			"progress": x["progress"],
			"project_uuid": x["project_uuid"],
			"text": x["text"],
			"stdout": x["stdout"],
			"stderr": x["stderr"],
			"date_added": x["date_added"]
		}
	});

	const finished_tasks = message['finished'];

	var parsed_finished_tasks = _.map(finished_tasks, (x) => {
		return {
			"task_id": x["task_id"],
			"task_type": x["task_type"],
			"params": x["params"],
			"target": x["target"],
			"status": x["status"],
			"progress": x["progress"],
			"project_uuid": x["project_uuid"],
			"text": x["text"],
			"stdout": x["stdout"],
			"stderr": x["stderr"],
			"date_added": x["date_added"]
		}
	});

	return {
		...state,
		"tasks": {
			"active": parsed_active_tasks,
			"finished": parsed_finished_tasks
		}
	};
}

function set_loaded(state = initialState, action) {
	const message = action.message;

	return {
		...state,
		'loaded': message.value
	}
}

function setLoadingHosts(state = initialState, action) {
	const isLoading = action.isLoading;

	return {
		...state,
		'loaded': !isLoading
	}
}

function receiveHosts(state = initialState, action) {
	const hosts = action.message;

	return {
		...hosts,
		filters: state['filters']
	}
}

function hostCommentUpdated(state = initialState, action) {
	const { host_id, comment } = action.message;

	for (let each_host of state.data) {
		if (each_host.host_id == host_id) {
			let new_state = JSON.parse(JSON.stringify(state));

			for (let each_new_host of new_state.data) {
				if (each_new_host.host_id == host_id) {
					each_new_host.comment = comment;
					break;
				}
			}

			return new_state;
		}
	}

	return state;
}

function flushHosts(state = initialState, action) {
	return {
		...state,
		selected_hosts: initialState['selected_hosts'],
		data: initialState['data']
	}

}

function host_reduce(state = initialState, action) {
	if (action.message && action.message.project_uuid && (action.current_project_uuid != action.message.project_uuid)) { return state; }
	else {
		switch (action.type) {
			case RESOLVE_HOSTS:
				return resolve_hosts(state, action);
			case UPDATED_IPS:
				return updated_ips(state, action);	
			case HOST_DATA_UPDATED:
				return host_data_updated(state, action);
			case GET_TASKS_BY_HOSTS:
				return get_tasks_by_hosts(state, action);
			case SET_LOADED_HOSTS:
				return set_loaded(state, action);

			case SET_LOADING_HOSTS:
				return setLoadingHosts(state, action);
			case RECEIVE_HOSTS:
				return receiveHosts(state, action);
			case HOST_COMMENT_UPDATED:
				return hostCommentUpdated(state, action);
			case FLUSH_HOSTS:
				return flushHosts(state, action);
			default:
				return state;
		}
	}
}



export default host_reduce
