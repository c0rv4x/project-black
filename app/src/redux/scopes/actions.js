export const CREATE_SCOPE = 'CREATE_SCOPE'
export const DELETE_SCOPE = 'DELETE_SCOPE'
export const RENEW_SCOPES = 'RENEW_SCOPES'
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
