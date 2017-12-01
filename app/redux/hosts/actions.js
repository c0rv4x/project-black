export const CREATE_HOST = 'CREATE_HOST'
export const DELETE_HOST = 'DELETE_HOST'
export const RENEW_HOSTS = 'RENEW_HOSTS'
export const UPDATE_HOST = 'UPDATE_HOST'
export const RESOLVE_HOSTS = 'RESOLVE_HOSTS'


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

export function resolveHosts(message, current_project_uuid) {
	return {
		type: RESOLVE_HOSTS,
		current_project_uuid: current_project_uuid,
		message
	}
}