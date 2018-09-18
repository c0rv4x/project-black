export const CREATE_IP = 'CREATE_IP'
export const DELETE_IP = 'DELETE_IP'
export const RENEW_IPS = 'RENEW_IPS'
export const UPDATE_IP = 'UPDATE_IP'
export const UPDATED_IPS = 'UPDATED_IPS'
export const GET_TASKS_BY_IPS = 'GET_TASKS_BY_IPS'


export function createIP(message, current_project_uuid) {
	return {
		type: CREATE_IP,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function deleteIP(message, current_project_uuid) {
	return {
		type: DELETE_IP,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function renewIPs(message, current_project_uuid) {
	return {
		type: RENEW_IPS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function updateIP(message, current_project_uuid) {
	return {
		type: UPDATE_IP,
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

export function getByIps(message, current_project_uuid) {
	return { type: GET_TASKS_BY_IPS,
		current_project_uuid: current_project_uuid,
		message
	}
}
