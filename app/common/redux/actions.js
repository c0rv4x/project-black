export const CREATE_PROJECT = 'CREATE_PROJECT'
export const DELETE_PROJECT = 'DELETE_PROJECT'
export const RENEW_PROJECT = 'RENEW_PROJECT'
export const UPDATE_PROJECT = 'UPDATE_PROJECT'


export function createProject(message) {
  return { type: CREATE_PROJECT, message }
}

export function deleteProject(message) {
  return { type: DELETE_PROJECT, message }
}

export function renewProjects(message) {
  return { type: RENEW_PROJECT, message }
}

export function updateProject(message) {
  return { type: UPDATE_PROJECT, message }
}
