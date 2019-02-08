import fetch from 'cross-fetch'

export const RENEW_CREDS_STATS = 'RENEW_CREDS_STATS'
export const RENEW_CREDS = 'RENEW_CREDS'


export function renewCredsStats(message, current_project_uuid) {
	return {
		type: RENEW_CREDS_STATS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function renewCreds(message, current_project_uuid) {
	return {
		type: RENEW_CREDS,
		current_project_uuid: current_project_uuid,
		message
	}
}


export function fetchCreds(targets) {
	return (dispatch, getState) => {
		console.log(123);
		const { project_uuid } = getState();

		fetch(`/project/${project_uuid}/creds`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				targets: targets
			})
		})
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => dispatch(receiveCreds(json))
			)
	}
}

export const RECEIVE_CREDS = 'RECEIVE_CREDS'
export function receiveCreds(creds) {
	return {
		type: RECEIVE_CREDS,
		creds
	}
}