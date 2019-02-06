export const CREATE_SCOPE = 'CREATE_SCOPE'


export function createScope(message, current_project_uuid) {
	return {
		type: CREATE_SCOPE,
		current_project_uuid: current_project_uuid,
		message
	}
}


export function requestCreateScope(project_uuid, scopes) {
	return dispatch => {
		fetch(`/project/${project_uuid}/scopes/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				'project_uuid': project_uuid,
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
				response => response.json(),
				error => console.log(error)
			)
			.then(
				json => {
					if (json.status == 'ok') {
						dispatch(notifySuccess("IP comment updated"))
					}
					else {
						dispatch(notifyError("Error updating IP comment " + json.message));
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
