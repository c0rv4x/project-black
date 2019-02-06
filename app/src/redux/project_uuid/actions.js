export const SET_PROJECT_UUID = 'SET_PROJECT_UUID'

export function setProjectUuid(project_uuid) {
	return {
		type: SET_PROJECT_UUID,
		project_uuid: project_uuid
	}
}