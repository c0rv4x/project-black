import fetch from 'cross-fetch'


export function fetchCredsForIPs() {
	return (dispatch, getState) => {
		const { project_uuid, ips } = getState();
		const targets = ips.data.map((ip) => ip.ip_address);

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
		creds: creds.creds
	}
}