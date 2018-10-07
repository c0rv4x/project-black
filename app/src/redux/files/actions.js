export const RENEW_TOTAL_AMOUNT = 'RENEW_TOTAL_AMOUNT'
export const ADD_NEW_STATS = 'ADD_NEW_STATS'


export function renewTotalAmount(message, current_project_uuid) {
	return {
		type: RENEW_TOTAL_AMOUNT,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function addNewStats(message, current_project_uuid) {
	return {
		type: ADD_NEW_STATS,
		current_project_uuid: current_project_uuid,
		message
	}
}
