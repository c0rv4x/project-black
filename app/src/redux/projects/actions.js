import fetch from 'cross-fetch'


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


export function submitDeleteProject(projectUUID) {
	return dispatch =>
	fetch(
		'/projects/delete', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				uuid: projectUUID
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