export const RENEW_FILES = 'RENEW_FILES'


export function renewFiles(message, current_project_uuid) {
	return {
		type: RENEW_FILES,
		current_project_uuid: current_project_uuid,
		message
	}
}
