import { notifySuccess, notifyError } from '../notifications/actions.js'


export const UPDATED_IPS = 'UPDATED_IPS'
export const RESOLVE_HOSTS = 'RESOLVE_HOSTS'
export const HOST_DATA_UPDATED = 'HOST_DATA_UPDATED'
export const GET_TASKS_BY_HOSTS = 'GET_TASKS_BY_HOSTS'
export const SET_LOADED_HOSTS = 'SET_LOADED_HOSTS'


export function updatedIPs(message, current_project_uuid) {
	return {
		type: UPDATED_IPS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function resolveHosts(message, current_project_uuid) {
	return {
		type: RESOLVE_HOSTS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function hostsDataUpdated(message, current_project_uuid) {
	return {
		type: HOST_DATA_UPDATED,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function getTasksByHosts(message, current_project_uuid) {
	return {
		type: GET_TASKS_BY_HOSTS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function setLoaded(message, current_project_uuid) {
	return {
		type: SET_LOADED_HOSTS,
		current_project_uuid: current_project_uuid,
		message
	}
}

/////

export const RECEIVE_HOSTS = 'RECEIVE_HOSTS'
export function receiveHosts(message) {
	return { type: RECEIVE_HOSTS, message }
}


export function requestSingleHost(project_uuid, hostname) {
	return dispatch => {
		dispatch(setLoadingHosts(true));
		dispatch(fetchSingleHost(project_uuid, hostname)).then(() => {
			dispatch(setLoadingHosts(false))
		});
	}
}

export function fetchSingleHost(project_uuid, hostname) {
	return dispatch =>
		fetch(`/project/${project_uuid}/host/get/${hostname}`)
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => dispatch(receiveHosts(json))
			)
}



export const FLUSH_HOSTS = 'FLUSH_HOSTS'
export function flushHosts(isLoading) {
	return { type: FLUSH_HOSTS, isLoading }
}

export function flushAndRequestHosts(project_uuid, filters={}, host_page=0, host_page_size=12) {
	return dispatch => {
		dispatch(flushHosts());
		dispatch(requestHosts(project_uuid, filters, host_page, host_page_size));
	}
}


export function requestHosts(project_uuid, filters={}, host_page=0, host_page_size=12) {
	const params = {
		filters: filters,
		host_page: host_page,
		host_page_size: host_page_size,
	}

	return dispatch => {
		dispatch(setLoadingHosts(true));
		dispatch(fetchHosts(project_uuid, params)).then(() => {
			dispatch(setLoadingHosts(false))
		});
	}
}



export const SET_LOADING_HOSTS = 'SET_LOADING_HOSTS'
export function setLoadingHosts(isLoading) {
	return { type: SET_LOADING_HOSTS, isLoading }
}

export function fetchHosts(project_uuid, params) {
	const filters = encodeURIComponent(JSON.stringify(params['filters']));

	const queryFields = [
		`filters=${filters}`,
		`host_page=${params['host_page']}`,
		`host_page_size=${params['host_page_size']}`,
	];

	const query = queryFields.join('&');

	return dispatch =>
		fetch(`/project/${project_uuid}/hosts?${query}`)
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => dispatch(receiveHosts(json))
			)
}



export function requestUpdateHostComment(project_uuid, host_id, comment) {
	return dispatch =>
	fetch(`/project/${project_uuid}/host/update/${host_id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			comment: comment
		})
	})
		.then(
			response => response.json(),
			error => console.log(error)
		)
		.then(
			json => {
				if (json.status == 'ok') {
					dispatch(notifySuccess("Host comment updated"))
				}
				else {
					dispatch(notifyError("Error updating host comment " + json.message));
				}				
			}
		)
}

export function requestDelteHost(project_uuid, host_id) {
	return dispatch =>
		fetch(`/project/${project_uuid}/host/delete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				host_id: host_id
			})
		})
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => dispatch(renewHostsCurrentPage())
			)
}


export function renewHostsCurrentPage() {
	return (dispatch, getState) => {
		const { project_uuid, hosts } = getState();

		dispatch(flushHosts());
		dispatch(requestHosts(project_uuid, hosts.filters, hosts.page, hosts.page_size));
	}
}


export function hostsCreated(message) {
	return (dispatch, getState) => {
		const { project_uuid } = getState();

		if (project_uuid == message.project_uuid) {
			dispatch(renewHostsCurrentPage());
		}
	}
}


export function hostDeleted(message) {
	return (dispatch, getState) => {
		const { project_uuid, hosts } = getState();

		dispatch(requestHosts(project_uuid, hosts.filters, hosts.page, hosts.page_size));
	}
}

export const SET_HOSTS_FILTERS = 'SET_HOSTS_FILTERS'

export function setHostsFilters(filters) {
	return {
		type: SET_HOSTS_FILTERS,
		filters
	}
}


export const HOST_COMMENT_UPDATED = 'HOST_COMMENT_UPDATED'

export function hostCommentUpdated(message, current_project_uuid) {
	return {
		type: HOST_COMMENT_UPDATED,
		current_project_uuid: current_project_uuid,
		message
	}
}
