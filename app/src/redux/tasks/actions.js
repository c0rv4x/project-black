import fetch from 'cross-fetch'

export const RENEW_TASKS = 'RENEW_TASKS'
export const UPDATE_TASKS = 'UPDATE_TASKS'


export function renewTasks(message, current_project_uuid) {
	return { type: RENEW_TASKS,
		current_project_uuid: current_project_uuid,
		message
	}
}

export function updateTasks(message, current_project_uuid) {
	return { type: UPDATE_TASKS,
		current_project_uuid: current_project_uuid,
		message
	}
}


/////

export function requestCreateTask(task_type, filters, params) {
	return (dispatch, getState) => {
		const { project_uuid } = getState();

		fetch(`/project/${project_uuid}/tasks/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				task_type: task_type,
				filters: filters,
				params: params
			})
		})
			.then(
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => {
					// The new tasks will be added to the store on sio
					// event. As this event will be broadcasted among all clients
				}
			)
	}
}

export const TASKS_CREATED = 'TASKS_CREATED'

export function tasksCreated(message, current_project_uuid) {
	return { type: TASKS_CREATED,
		message,
		current_project_uuid
	}
}