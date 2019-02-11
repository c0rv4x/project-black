import fetch from 'cross-fetch'
import { notifyError } from '../notifications/actions.js'

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
			response => response.json().then(json => ({
				status: response.status,
				json
			}))
		)
		.then(
			({ status, json }) => {
				if (status == 200) {
					dispatch(dispatch(setDicts(json)));
				}
				else {
					dispatch(notifyError("Error requesting dictionaries. " + json.message));
				}
			}
		)
	}
}