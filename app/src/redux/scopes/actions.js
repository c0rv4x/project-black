export const CREATE_SCOPE = 'CREATE_SCOPE'


export function createScope(message, current_project_uuid) {
	return {
		type: CREATE_SCOPE,
		current_project_uuid: current_project_uuid,
		message
	}
}
