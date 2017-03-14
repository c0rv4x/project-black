export const CREATE_PROJECT = 'CREATE_PROJECT'
export const DELETE_PROJECT = 'DELETE_PROJECT'


export function createProject(project) {
  return { type: CREATE_PROJECT, project }
}

export function deleteProject(project_uuid) {
  return { type: DELETE_PROJECT, project_uuid }
}
