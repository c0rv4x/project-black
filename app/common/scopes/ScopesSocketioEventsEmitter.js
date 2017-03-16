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
        return target.match(/^([a-zA-Z]{1}[a-zA-Z0-9\-]{0,255}\.){1,}[a-zA-Z]{2,15}$/);
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

let instance = null;

class ScopesSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the scopes */
	constructor() {
        if(!instance){
            instance = this;

            this.connector = new Connector();
        }

        return instance;
	}

	createScope(project_uuid, scopes) {
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

	deleteScope(scope_id) {
		this.connector.emit('scopes:delete:scope_id', {
			'scope_id': scope_id
		});
	}

	// updateScopes(scope_uuid, scope_name, comment) {
	// 	this.connector.emit('scopes:update', {
	// 		'scope_uuid': scope_uuid,
	// 		'scope_name': scope_name,
	// 		'comment': comment
	// 	});
	// }

	renewScopes() {
		this.connector.emit('scopes:all:get');
	}

}

export default ScopesSocketioEventsEmitter;