export const CREATE_HOST = 'CREATE_HOST'
export const DELETE_HOST = 'DELETE_HOST'
export const RENEW_HOSTS = 'RENEW_HOSTS'
export const UPDATE_HOST = 'UPDATE_HOST'
export const UPDATED_IPS = 'UPDATED_IPS'
export const RESOLVE_HOSTS = 'RESOLVE_HOSTS'
export const HOST_DATA_UPDATED = 'HOST_DATA_UPDATED'
export const GET_TASKS_BY_HOSTS = 'GET_TASKS_BY_HOSTS'
export const SET_LOADED_HOSTS = 'SET_LOADED_HOSTS'


export function createHost(message, current_project_uuid) {
	return {
		type: CREATE_HOST,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function deleteHost(message, current_project_uuid) {
	return {
		type: DELETE_HOST,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function renewHosts(message, current_project_uuid) {
	return {
		type: RENEW_HOSTS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function updateHost(message, current_project_uuid) {
	return {
		type: UPDATE_HOST,
		current_project_uuid: current_project_uuid,
		message
	}
}

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