export const RENEW_TOTAL_AMOUNT = 'RENEW_TOTAL_AMOUNT'


export function renewTotalAmount(message, current_project_uuid) {
	return {
		type: RENEW_TOTAL_AMOUNT,
		current_project_uuid: current_project_uuid,
		message
	}
}
