export const CREATE_SCOPE = 'CREATE_SCOPE'
export const DELETE_SCOPE = 'DELETE_SCOPE'
export const RENEW_SCOPES = 'RENEW_SCOPES'
export const CLEAR_SCOPES = 'CLEAR_SCOPES'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const UPDATE_SCOPE = 'UPDATE_SCOPE'


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

export function clearScopes(message, current_project_uuid) {
	return {
		type: CLEAR_SCOPES,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function updateComment(message, current_project_uuid) {
	return {
		type: UPDATE_COMMENT,
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
