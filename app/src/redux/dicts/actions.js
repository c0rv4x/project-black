export const SET_DICTS = 'SET_DICTS'


export function setDicts(message, current_project_uuid) {
	return {
		type: SET_DICTS,
		current_project_uuid: current_project_uuid,
		message
	}
}
