import Connector from '../SocketConnector.jsx';


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

	// createProject(scope_name) {
	// 	this.connector.emit('scopes:create', {
	// 		'scope_name': scope_name
	// 	});
	// }

	// deleteProject(scope_uuid) {
	// 	this.connector.emit('scopes:delete:scope_uuid', {
	// 		'scope_uuid': scope_uuid
	// 	});
	// }

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