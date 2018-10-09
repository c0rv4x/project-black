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
