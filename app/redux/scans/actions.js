export const RENEW_STATS = 'RENEW_STATS'


export function renewStats(message, current_project_uuid) {
	console.log(123123);
    return { 
        type: RENEW_STATS,
        current_project_uuid: current_project_uuid,
        message 
    }
}
