export const CREATE_SCOPE = 'CREATE_SCOPE'
export const DELETE_SCOPE = 'DELETE_SCOPE'
export const RENEW_SCOPES = 'RENEW_SCOPES'


export function createScope(message) {
	return { type: CREATE_SCOPE, message }
}

export function deleteScope(message) {
	return { type: DELETE_SCOPE, message }
}

export function renewScopes(message) {
	return { type: RENEW_SCOPES, message }
}
