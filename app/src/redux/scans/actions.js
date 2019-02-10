import fetch from 'cross-fetch'


export function requestCountScans() {
    return dispatch => {
        dispatch(setLoadingScans(true));
        dispatch(fetchCountScans()).then(
            () => dispatch(setLoadingScans(false))
        );
    }
}


export const SET_LOADING_SCANS = 'SET_LOADING_SCANS'

export function setLoadingScans(loading) {
    return { 
        type: SET_LOADING_SCANS,
        loading 
    }
}


export function fetchCountScans() {
    return (dispatch, getState) => {
        const { project_uuid } = getState();

        return fetch(`/project/${project_uuid}/scans/count`)
        .then(
			response => response.json(),
			error => console.log(error)
		)
		.then(
			json => dispatch(renewCount(json))
		)
    }
}


export const RENEW_SCANS_STATS = 'RENEW_SCANS_STATS'

export function renewCount(amount) {
    return { 
        type: RENEW_SCANS_STATS,
        amount 
    }
}