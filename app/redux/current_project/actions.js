export const RENEW_CURRENT_PROJECT = 'RENEW_CURRENT_PROJECT'


export function renewCurrentProject(message) {
	return { type: RENEW_CURRENT_PROJECT, message }
}
