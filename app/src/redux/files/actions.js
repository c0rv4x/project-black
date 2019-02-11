import fetch from 'cross-fetch'


/////


export function fetchFilesStatsIPs() {
	return (dispatch, getState) => {
		const { project_uuid, ips } = getState();
		const { filters } = ips;

		return fetch(`/project/${project_uuid}/files/stats/ips`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ip_ids: ips.data.map((ip) => ip.ip_id),
				filters: filters
			})
		})
			.then(
				response => response.json().then(json => ({
					status: response.status,
					json
				}))
			)
			.then(
				({ status, json }) => {
					if (status == 200) {
						dispatch(receiveFilesStatsIPs(json));
					}
					else {
						dispatch(notifyError("Error fetching files stats for IP. " + json.message));
					}
				}
			)
	}
}


export const RECEIVE_FILES_STATS_IPS = 'RECEIVE_FILES_STATS_IPS';

export function receiveFilesStatsIPs(stats) {
	return {
		type: RECEIVE_FILES_STATS_IPS,
		stats
	}
}


export function requestFilesIP(ip, port_number, limit, offset, filters) {
	return (dispatch, getState) => {
		const { project_uuid } = getState();

		return fetch(`/project/${project_uuid}/files/data/ip`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ip: ip,
				port_number: port_number,
				limit: limit,
				offset: offset,
				filters: filters
			})
		})
			.then(
				response => response.json().then(json => ({
					status: response.status,
					json
				}))
			)
			.then(
				({ status, json }) => {
					if (status == 200) {
						dispatch(receiveFilesDataIPs(ip, port_number, json));
					}
					else {
						dispatch(notifyError("Error fetching files data for IP. " + json.message));
					}
				}
			)
	}
}

export const RECEIVE_FILES_DATA_IPS = 'RECEIVE_FILES_DATA_IPS'

export function receiveFilesDataIPs(ip, port_number, files) {
    return { 
        type: RECEIVE_FILES_DATA_IPS,
		ip,
		port_number,
		files
    }
}


export function fetchFilesStatsHosts() {
	return (dispatch, getState) => {
		const { project_uuid, hosts } = getState();
		const { filters } = hosts;

		return fetch(`/project/${project_uuid}/files/stats/hosts`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				host_ids: hosts.data.map((host) => host.host_id),
				filters: filters
			})
		})
			.then(
				response => response.json().then(json => ({
					status: response.status,
					json
				}))
			)
			.then(
				({ status, json }) => {
					if (status == 200) {
						dispatch(receiveFilesStatsHosts(json));
					}
					else {
						dispatch(notifyError("Error fetching files stats for host. " + json.message));
					}
				}
			)
	}
}


export const RECEIVE_FILES_STATS_HOSTS = 'RECEIVE_FILES_STATS_HOSTS';

export function receiveFilesStatsHosts(stats) {
	return {
		type: RECEIVE_FILES_STATS_HOSTS,
		stats
	}
}


export function requestCountFiles() {
    return dispatch => {
        dispatch(setLoadingFiles(true));
        dispatch(fetchCountFiles()).then(
            () => dispatch(setLoadingFiles(false))
        );
    }
}


export const SET_LOADING_FILES = 'SET_LOADING_FILES'

export function setLoadingFiles(loading) {
    return { 
        type: SET_LOADING_FILES,
        loading 
    }
}


export function fetchCountFiles() {
    return (dispatch, getState) => {
        const { project_uuid } = getState();

        return fetch(`/project/${project_uuid}/files/count`)
        .then(
			response => response.json().then(json => ({
				status: response.status,
				json
			}))
		)
		.then(
			({ status, json }) => {
				if (status == 200) {
					dispatch(renewCount(json));
				}
				else {
					dispatch(notifyError("Error fetching files stats for host. " + json.message));
				}
			}
		)
    }
}


export const RENEW_FILES_STATS = 'RENEW_FILES_STATS'

export function renewCount(amount) {
    return { 
        type: RENEW_FILES_STATS,
        amount 
    }
}


export function requestFilesHost(host, port_number, limit, offset, filters) {
	return (dispatch, getState) => {
		const { project_uuid } = getState();

		return fetch(`/project/${project_uuid}/files/data/host`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				host: host,
				port_number: port_number,
				limit: limit,
				offset: offset,
				filters: filters
			})
		})
			.then(
				response => response.json().then(json => ({
					status: response.status,
					json
				}))
			)
			.then(
				({ status, json }) => {
					if (status == 200) {
						dispatch(receiveFilesDataHosts(host, port_number, json));
					}
					else {
						dispatch(notifyError("Error fetching files stats for host. " + json.message));
					}
				}
			)
	}
}

export const RECEIVE_FILES_DATA_HOSTS = 'RECEIVE_FILES_DATA_HOSTS'

export function receiveFilesDataHosts(host, port_number, files) {
    return { 
        type: RECEIVE_FILES_DATA_HOSTS,
		host,
		port_number,
		files
    }
}