import { notifySuccess, notifyError } from '../notifications/actions.js'


export const SET_SCOPES_CREATED = 'SET_SCOPES_CREATED'


export function setScopesCreated(scopeCreated) {
	return {
		type: SET_SCOPES_CREATED,
		scopeCreated
	}
}


export function requestCreateScope(project_uuid, scopes) {
	return dispatch => {
		dispatch(setScopesCreated(false));

		fetch(`/project/${project_uuid}/scopes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				'scopes': scopes.split('\n').map((x) => {
					const scope = x.trim();
	
					return {
						"type": findScopeType(scope),
						"target": scope
					}
				})
			})
		})
			.then(
				response => response.json().then(json => ({
					status: response.status,
					json
				}))
			)
			.then(
				({ status, json }) => {
					if (status == 200) {
						dispatch(notifySuccess("Scopes added"))
						dispatch(setScopesCreated(true));
						// Data update will be fired when sio event is received
						// This is done to make sure we don't update the data twice:
						//     - on http request success
						//     - on sio event received
					}
					else {
						dispatch(notifyError("Error updating IP comment " + json.message));
						dispatch(setScopesCreated(true));
					}
				}
			)
	}
}

function findScopeType(target) {
    function tryip_addressNetwork(target) {
        return target.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}$/);
    }

    function tryip_addressAddress(target) {
        return target.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/);
    }

    function tryHostname(target) {
        return target.match(/^([a-zA-Z0-9]{1}[a-zA-Z0-9\-]{0,255}\.){1,}[a-zA-Z]{2,15}$/);
    }

    if (tryip_addressNetwork(target)) {
        return "network";
    }
    else if (tryip_addressAddress(target)) {
        return "ip_address";
    }
    else if (tryHostname(target)) {
        return "hostname";
    }
    else {
        return "error";
    }
}
