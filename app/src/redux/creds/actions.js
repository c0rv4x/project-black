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

export function fetchCredsForHosts() {
	return (dispatch, getState) => {
		const { project_uuid, hosts } = getState();
		const targets = hosts.data.map((host) => host.hostname);

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

export function requestDeleteCreds(target, port_number) {
	return (dispatch, getState) => {
		const { project_uuid } = getState();

		fetch(`/project/${project_uuid}/creds/delete?target=${target}&port_number=${port_number}`)
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => {
					if (isIP(target)) {
						dispatch(fetchCredsForIPs())
					}
					else {
						dispatch(fetchCredsForHosts())
					}
				}
			)
	}
}


function isIP(ipaddress) {  
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
	  return (true)  
	}  
	return (false)  
} 