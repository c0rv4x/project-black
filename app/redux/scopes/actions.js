export const CREATE_SCOPE = 'CREATE_SCOPE'
export const DELETE_SCOPE = 'DELETE_SCOPE'
export const RENEW_SCOPES = 'RENEW_SCOPES'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const UPDATE_SCOPE = 'UPDATE_SCOPE'


export function createScope(message) {
	return { type: CREATE_SCOPE, message }
}

export function deleteScope(message) {
	return { type: DELETE_SCOPE, message }
}

export function renewScopes(message) {
	return { type: RENEW_SCOPES, message }
}

export function updateComment(message) {
	return { type: UPDATE_COMMENT, message }
}

export function updateScope(message) {
	return { type: UPDATE_SCOPE, message }
}