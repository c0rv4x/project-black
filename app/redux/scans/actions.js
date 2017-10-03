export const RENEW_SCANS = 'RENEW_SCANS'


export function renewScans(message, current_project_uuid) {
    return { 
        type: RENEW_SCANS,
        current_project_uuid: current_project_uuid,
        message 
    }
}
