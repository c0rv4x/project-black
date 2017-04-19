export const RENEW_FILES = 'RENEW_FILES'


export function renewFiles(message) {
	return { type: RENEW_FILES, message }
}
