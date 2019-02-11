import fetch from 'cross-fetch'


export const RENEW_TOTAL_AMOUNT = 'RENEW_TOTAL_AMOUNT'
export const ADD_STATS_HOSTS = 'ADD_STATS_HOSTS'
export const ADD_STATS_IPS = 'ADD_STATS_IPS'
export const ADD_FILES_IPS = 'ADD_FILES_IPS'
export const ADD_FILES_HOSTS = 'ADD_FILES_HOSTS'
export const EMPTY_FILES = 'EMPTY_FILES'


export function renewTotalAmount(message, current_project_uuid) {
	return {
		type: RENEW_TOTAL_AMOUNT,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function addStatsIps(message, current_project_uuid) {
	return {
		type: ADD_STATS_IPS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function addStatsHosts(message, current_project_uuid) {
	return {
		type: ADD_STATS_HOSTS,
		current_project_uuid: current_project_uuid,
		message
	}
}
export function addFilesHosts(message, current_project_uuid) {
	return {
		type: ADD_FILES_HOSTS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function addFilesIps(message, current_project_uuid) {
	return {
		type: ADD_FILES_IPS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function emptyFiles(message, current_project_uuid) {
	return {
		type: EMPTY_FILES,
		current_project_uuid: current_project_uuid,
		message
	}
}


/////

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
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => {
					dispatch(receiveFilesStatsHosts(json));			
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
			response => response.json(),
			error => console.log(error)
		)
		.then(
			json => dispatch(renewCount(json))
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