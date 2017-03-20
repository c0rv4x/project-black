export const CREATE_PROJECT = 'CREATE_PROJECT'
export const DELETE_PROJECT = 'DELETE_PROJECT'
export const RENEW_PROJECTS = 'RENEW_PROJECTS'
export const UPDATE_PROJECT = 'UPDATE_PROJECT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'


export function createProject(message) {
	return { type: CREATE_PROJECT, message }
}

export function deleteProject(message) {
	return { type: DELETE_PROJECT, message }
}

export function renewProjects(message) {
	return { type: RENEW_PROJECTS, message }
}

export function updateProject(message) {
	return { type: UPDATE_PROJECT, message }
}

export function updateComment(message) {
	return { type: UPDATE_COMMENT, message }
}
