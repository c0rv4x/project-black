export const RENEW_SCANS = 'RENEW_SCANS'


export function renewScans(message) {
	return { type: RENEW_SCANS, message }
}