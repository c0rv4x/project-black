export const NEW_TASK = 'NEW_TASK'
export const CHANGE_STATUS_TASK = 'CHANGE_STATUS_TASK'
export const RENEW_TASKS = 'RENEW_TASKS'
export const UPDATE_TASKS = 'UPDATE_TASKS'


export function newTask(message, current_project_uuid) {
	return { type: NEW_TASK,
		current_project_uuid: current_project_uuid
		message
	}
}

export function changeStatusTask(message, current_project_uuid) {
	return { type: CHANGE_STATUS_TASK,
		current_project_uuid: current_project_uuid
		message
	}
}

export function renewTasks(message, current_project_uuid) {
	return { type: RENEW_TASKS,
		current_project_uuid: current_project_uuid
		message
	}
}

export function updateTasks(message, current_project_uuid) {
	return { type: UPDATE_TASKS,
		current_project_uuid: current_project_uuid
		message
	}
}
