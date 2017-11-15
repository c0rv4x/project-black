import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


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


class ScopesSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the scopes */
	constructor() {
        this.connector = new Connector('scopes');
	}

	requestCreateScope(scopes, project_uuid) {
		this.connector.emit('scopes:create', {
			'project_uuid': project_uuid,
			'scopes': _.map(scopes.split(','), (x) => {
				const scope = x.trim();

				return {
					"type": findScopeType(scope),
					"target": scope
				}
			})
		});
	}

	requestDeleteScope(scope_id, project_uuid) {
		this.connector.emit('scopes:delete:scope_id', {
			'scope_id': scope_id,
			'project_uuid': project_uuid
		});
	}

	requestResolveScopes(scopes_ids, project_uuid) {
		this.connector.emit('scopes:resolve', {
			'scopes_ids': scopes_ids,
			'project_uuid': project_uuid
		});
	}

	requestRenewScopes(project_uuid) {
		console.log('requested');
		this.connector.emit('scopes:all:get', {
			'project_uuid': project_uuid
		});
	}

	requestUpdateScope(comment, scope_id, project_uuid) {
		this.connector.emit('scopes:update', {
			'scope_id': scope_id,
			'comment': comment,
			'project_uuid': project_uuid
		});
	}

	requestUpdateComment(comment, scope_id, project_uuid) {
		this.connector.emit('scopes:update:comment', {
			'scope_id': scope_id,
			'comment': comment,
			'project_uuid': project_uuid
		});
	}	

}

export default ScopesSocketioEventsEmitter;
