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
