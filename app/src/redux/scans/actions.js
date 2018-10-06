export const RENEW_SCANS_STATS = 'RENEW_SCANS_STATS'


export function renewCount(message, current_project_uuid) {
    return { 
        type: RENEW_SCANS_STATS,
        current_project_uuid: current_project_uuid,
        message 
    }
}
