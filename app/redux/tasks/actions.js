export const NEW_TASK = 'NEW_TASK'
export const CHANGE_STATUS_TASK = 'CHANGE_STATUS_TASK'
export const RENEW_TASKS = 'RENEW_TASKS'
export const UPDATE_TASKS = 'UPDATE_TASKS'


export function newTask(message) {
	return { type: NEW_TASK, message }
}

export function changeStatusTask(message) {
	return { type: CHANGE_STATUS_TASK, message }
}

export function renewTasks(message) {
	return { type: RENEW_TASKS, message }
}

export function updateTasks(message) {
	return { type: UPDATE_TASKS, message }
}
