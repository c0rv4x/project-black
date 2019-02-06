import _ from 'lodash';

import { 
	UPDATED_IPS,
	GET_TASKS_BY_IPS,

	SET_LOADING_IPS,
	RECEIVE_IPS,
	IP_COMMENT_UPDATED,
	FLUSH_IPS,
	SET_IPS_FILTERS
} from './actions.js'


const initialState = {
	"loaded": false,
	"page": 0,
	"page_size": 12,
	"total_db_ips": 0,
	"selected_ips": 0,
	"data": [],
	"filters": {},
	"tasks": {
		"active": [],
		"finished": []
	}
}

function create_ip(state = initialState, action) {
	const message = action.message;

	let new_state = JSON.parse(JSON.stringify(state));
	let new_ips = message.new_ips;

	new_state.data = new_ips.concat(new_state.data).slice(0, new_state.page_size);
	new_state.total_db_ips += new_ips.length;

	if (new_state.page_size > new_state.selected_ips) {
		new_state.selected_ips += 1;
	}

	new_state.update_needed = false;	

	return new_state;
}

function delete_ip(state = initialState, action) {
	return {
		...state,
		'loaded': true,
		'update_needed': true
	};
}


function updated_ips(state = initialState, action) {
	const message = action.message;

	var found = false;

	if (message.updated_ips) {

		for (var each_ip_address of message.updated_ips) {
			for (var state_ip of state.data) {
				if (state_ip.ip_address == each_ip_address) {
					found = true;
					break;
				}
			}
			if (found) break;
		}
	}
	else if (message.updated_ip_address) {
		for (var state_ip of state.data) {
			if (state_ip.ip_address == message.updated_ip_address) {
				found = true;
				break;
			}
		}
	}
	else {
		found = True
	}

	if (found) {
		var new_state = JSON.parse(JSON.stringify(state));

		new_state.update_needed = true;

		return new_state;
	}
	else {
		return state;
	}
}

function get_tasks_by_ips(state = initialState, action) {
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

////////

function flushIPs(state = initialState, action) {
	return {
		...state,
		selected_ips: initialState['selected_ips'],
		data: initialState['data']
	}
}

function setLoadingIPs(state = initialState, action) {
	const isLoading = action.isLoading;

	return {
		...state,
		loaded: !isLoading
	}
}

function receiveIPs(state = initialState, action) {
	const ips = action.message;

	return {
		...ips,
		filters: state['filters']
	}
}


function ipCommentUpdated(state = initialState, action) {
	const message = action.message;

	var { ip_id, comment } = message;

	for (let each_ip of state.data) {
		if (each_ip.ip_id == ip_id) {
			let new_state = JSON.parse(JSON.stringify(state));

			for (let each_new_ip of new_state.data) {
				if (each_new_ip.ip_id == ip_id) {
					each_new_ip.comment = comment;
					break;
				}
			}

			return new_state;
		}
	}

	return state;
}

function setIPsFilters(state = initialState, action) {
	return {
		...state,
		filters: action.filters
	}
}


function ip_reduce(state = initialState, action) {
	if (action.message && action.message.project_uuid && (action.current_project_uuid != action.message.project_uuid)) { return state; }
	else {
		switch (action.type) {
			case UPDATED_IPS:
				return updated_ips(state, action);
			case GET_TASKS_BY_IPS:
				return get_tasks_by_ips(state, action);

			case SET_LOADING_IPS:
				return setLoadingIPs(state, action);
			case RECEIVE_IPS:
				return receiveIPs(state, action);
			case IP_COMMENT_UPDATED:
				return ipCommentUpdated(state, action);
			case FLUSH_IPS:
				return flushIPs(state, action);
			case SET_IPS_FILTERS:
				return setIPsFilters(state, action);
			default:
				return state;
		}
	}
}



export default ip_reduce
