import fetch from 'cross-fetch'

export const SET_DICTS = 'SET_DICTS'

export function setDicts(dicts) {
	return {
		type: SET_DICTS,
		dicts
	}
}

export function requestDicts() {
	return (dispatch, getState) =>  {
		const { project_uuid } = getState();

		fetch(`/project/${project_uuid}/dicts/stats`)
		.then(
			response => response.json(),
			error => console.log(error)
		)
		.then(
			json => {
				console.log(json);dispatch(setDicts(json))}
		)
	}
}