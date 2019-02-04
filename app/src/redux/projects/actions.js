import fetch from 'cross-fetch'


export const CREATE_PROJECT = 'CREATE_PROJECT'
export const DELETE_PROJECT = 'DELETE_PROJECT'
export const RENEW_PROJECTS = 'RENEW_PROJECTS'
export const UPDATE_PROJECT = 'UPDATE_PROJECT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'


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


export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS'
export function receiveProjects(message) {
	return { type: RECEIVE_PROJECTS, message }
}

export function fetchProjects() {
	return dispatch =>
		fetch('/projects')
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => dispatch(receiveProjects(json))
			)
}


export function submitNewProject(projectName) {
	return dispatch =>
	fetch(
		'/projects/create', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: projectName
			})
		}
	)
		.then(
			response => response.json(),
			error => console.log(error)
		)
		.then(
			json => dispatch(fetchProjects())
		)
}