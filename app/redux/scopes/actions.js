export const CREATE_SCOPE = 'CREATE_SCOPE'
export const DELETE_SCOPE = 'DELETE_SCOPE'
export const RENEW_SCOPES = 'RENEW_SCOPES'
export const RENEW_HOSTS = 'RENEW_HOSTS'
export const UPDATE_SCOPE = 'UPDATE_SCOPE'
export const RESOLVE_SCOPES = 'RESOLVE_SCOPES'


export function createScope(message, current_project_uuid) {
	return {
		type: CREATE_SCOPE,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function deleteScope(message, current_project_uuid) {
	return {
		type: DELETE_SCOPE,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function renewScopes(message, current_project_uuid) {
	return {
		type: RENEW_SCOPES,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function updateScope(message, current_project_uuid) {
	return {
		type: UPDATE_SCOPE,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function resolveScopes(message, current_project_uuid) {
	return {
		type: RESOLVE_SCOPES,
		current_project_uuid: current_project_uuid,
		message
	}
}