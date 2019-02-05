import fetch from 'cross-fetch'
import { notifySuccess, notifyError } from '../notifications/actions.js'


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
			json => {
				if (json.status == "ok") {
					dispatch(notifySuccess("Project created"));
					dispatch(fetchProjects())
				}
				else {
					dispatch(notifyError("Error creating projects " + json.message));
				}
			}
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
			json => {
				if (json.status == "ok") {
					dispatch(notifySuccess("Project deleted"));
					dispatch(fetchProjects())
				}
				else {
					dispatch(notifyError("Error deleting projects " + json.message));
				}
			}
		)
}


export function submitUpdateProject(projectUUID, parameters) {
	return dispatch =>
	fetch(
		'/projects/update', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				uuid: projectUUID,
				parameters
			})
		}
	)
		.then(
			response => response.json(),
			error => console.log(error)
		)
		.then(
			json => {
				if (json.status == "ok") {
					dispatch(notifySuccess("Project updated"));
					dispatch(fetchProjects());
				}
				else {
					dispatch(notifyError("Error updating projects " + json.message));
				}
			}
		)
}