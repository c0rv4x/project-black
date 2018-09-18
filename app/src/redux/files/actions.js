export const RENEW_FILES_STATS = 'RENEW_FILES_STATS'


export function renewFilesStats(message, current_project_uuid) {
	return {
		type: RENEW_FILES_STATS,
		current_project_uuid: current_project_uuid,
		message
	}
}
