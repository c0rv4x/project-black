import _ from 'lodash';

import { 
	UPDATED_IPS,

	SET_LOADING_IPS,
	RECEIVE_IPS,
	IP_COMMENT_UPDATED,
	FLUSH_IPS,
	SET_IPS_FILTERS,
	RECEIVE_TASKS_FOR_IPS
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

///

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

function receiveTasksForIPs(state = initialState, action) {
	const tasks = action.tasks;
	const active_tasks = tasks['active'];

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

	const finished_tasks = tasks['finished'];

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


function ip_reduce(state = initialState, action) {
	if (action.message && action.message.project_uuid && (action.current_project_uuid != action.message.project_uuid)) { return state; }
	else {
		switch (action.type) {
			case UPDATED_IPS:
				return updated_ips(state, action);

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
			case RECEIVE_TASKS_FOR_IPS:
				return receiveTasksForIPs(state, action);
			default:
				return state;
		}
	}
}



export default ip_reduce
