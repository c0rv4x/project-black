export const CREATE_PROJECT = 'CREATE_PROJECT'
export const DELETE_PROJECT = 'DELETE_PROJECT'


export function createProject(message) {
  return { type: CREATE_PROJECT, message }
}

export function deleteProject(message) {
  return { type: DELETE_PROJECT, message }
}
