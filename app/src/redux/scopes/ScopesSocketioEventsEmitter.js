import Connector from '../SocketConnector.jsx';


class ScopesSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the scopes */
	constructor() {
        this.connector = new Connector('scopes');
	}

	requestDeleteScope(scope_id, project_uuid, type) {
		this.connector.emit('scopes:delete:scope_id', {
			'scope_id': scope_id,
			'project_uuid': project_uuid,
			'scope_type': type
		});
	}

}

export default ScopesSocketioEventsEmitter;
