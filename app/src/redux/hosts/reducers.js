import _ from 'lodash';

import { 
	RESOLVE_HOSTS,

	SET_LOADING_HOSTS,
	RECEIVE_HOSTS,
	HOST_COMMENT_UPDATED,
	FLUSH_HOSTS,
	SET_HOSTS_FILTERS,
	RECEIVE_TASKS_FOR_HOSTS
} from './actions.js'


const initialState = {
	"loaded": false,
	"page": 0,
	"page_size": 12,
	"filters": {},
	"resolve_finished": false,
	"total_db_hosts": 0,
	"selected_hosts": 0,
	"data": [],
	"tasks": {
		"active": [],
		"finished": []
	}
}

function resolve_hosts(state = initialState, action) {
	return {
		...state,
		resolve_finished: true
	};
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
		...state,
		...hosts
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

function setHostsFilters(state = initialState, action) {
	return {
		...state,
		filters: action.filters
	}
}


function receiveTasksForHosts(state = initialState, action) {
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


function host_reduce(state = initialState, action) {
	if (action.message && action.message.project_uuid && (action.current_project_uuid != action.message.project_uuid)) { return state; }
	else {
		switch (action.type) {
			case RESOLVE_HOSTS:
				return resolve_hosts(state, action);

			case SET_LOADING_HOSTS:
				return setLoadingHosts(state, action);
			case RECEIVE_HOSTS:
				return receiveHosts(state, action);
			case HOST_COMMENT_UPDATED:
				return hostCommentUpdated(state, action);
			case FLUSH_HOSTS:
				return flushHosts(state, action);
			case SET_HOSTS_FILTERS:
				return setHostsFilters(state, action);
			case RECEIVE_TASKS_FOR_HOSTS:
				return receiveTasksForHosts(state, action);
			default:
				return state;
		}
	}
}



export default host_reduce
