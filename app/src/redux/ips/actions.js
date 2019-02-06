import { notifySuccess, notifyError } from '../notifications/actions.js'



export const RENEW_IPS = 'RENEW_IPS'
export const UPDATED_IPS = 'UPDATED_IPS'
export const GET_TASKS_BY_IPS = 'GET_TASKS_BY_IPS'
export const SET_LOADED = 'SET_LOADED'



export function updatedIPs(message, current_project_uuid) {
	return {
		type: UPDATED_IPS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function getByIps(message, current_project_uuid) {
	return { type: GET_TASKS_BY_IPS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function setLoaded(message, current_project_uuid) {
	return { type: SET_LOADED,
		current_project_uuid: current_project_uuid,
		message
	}
}

////// 

export const RECEIVE_IPS = 'RECEIVE_IPS'
export function receiveIPs(message) {
	return { type: RECEIVE_IPS, message }
}


export function requestSingleIP(project_uuid, ip_address) {
	return dispatch => {
		dispatch(setLoadingIPs(true));
		dispatch(fetchSingleIP(project_uuid, ip_address)).then(() => {
			dispatch(setLoadingIPs(false))
		});
	}
}

export function fetchSingleIP(project_uuid, ip_address) {
	return dispatch =>
		fetch(`/project/${project_uuid}/ip/get/${ip_address}`)
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => dispatch(receiveIPs(json))
			)
}


export const FLUSH_IPS = 'FLUSH_IPS'
export function flushIPs(isLoading) {
	return { type: FLUSH_IPS, isLoading }
}

export function flushAndRequestIPs(project_uuid, filters={}, ip_page=0, ip_page_size=12) {
	return dispatch => {
		dispatch(flushIPs());
		dispatch(requestIPs(project_uuid, filters, ip_page, ip_page_size));
	}
}


export function requestIPs(project_uuid, filters={}, ip_page=0, ip_page_size=12) {
	const params = {
		filters: filters,
		ip_page: ip_page,
		ip_page_size: ip_page_size,
	}

	return dispatch => {
		dispatch(setLoadingIPs(true));
		dispatch(fetchIPs(project_uuid, params)).then(() => {
			dispatch(setLoadingIPs(false))
		});
	}
}


export const SET_LOADING_IPS = 'SET_LOADING_IPS'
export function setLoadingIPs(isLoading) {
	return { type: SET_LOADING_IPS, isLoading }
}

export function fetchIPs(project_uuid, params) {
	const filters = encodeURIComponent(JSON.stringify(params['filters']));

	const queryFields = [
		`filters=${filters}`,
		`ip_page=${params['ip_page']}`,
		`ip_page_size=${params['ip_page_size']}`,
	];

	const query = queryFields.join('&');

	return dispatch =>
		fetch(`/project/${project_uuid}/ips?${query}`)
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => dispatch(receiveIPs(json))
			)
}


export function requestUpdateIPComment(project_uuid, ip_id, comment) {
	return dispatch =>
	fetch(`/project/${project_uuid}/ip/update/${ip_id}`, {
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
					dispatch(notifySuccess("IP comment updated"))
				}
				else {
					dispatch(notifyError("Error updating IP comment " + json.message));
				}				
			}
		)
}


export function IPsCreated(message) {
	return (dispatch, getState) => {
		const { project_uuid, ips } = getState();

		dispatch(requestIPs(project_uuid, ips.filters, ips.page, ips.page_size));
	}
}


export function IPDeleted(message) {
	return (dispatch, getState) => {
		const { project_uuid, ips } = getState();

		dispatch(requestIPs(project_uuid, ips.filters, ips.page, ips.page_size));
	}
}

export const SET_IPS_FILTERS = 'SET_IPS_FILTERS'

export function setIPsFilters(filters) {
	return {
		type: SET_IPS_FILTERS,
		filters
	}
}


export const IP_COMMENT_UPDATED = 'IP_COMMENT_UPDATED'

export function IPCommentUpdated(message, current_project_uuid) {
	return {
		type: IP_COMMENT_UPDATED,
		current_project_uuid: current_project_uuid,
		message
	}
}

