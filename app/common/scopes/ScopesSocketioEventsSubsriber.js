import { 
	createScope, 
	deleteScope,
	renewScopes
} from './actions';

import Connector from '../SocketConnector.jsx';
import ScopesSocketioEventsEmitter from './ScopesSocketioEventsEmitter.js';

let instance = null;

class ScopesEventsSubsriber {
	/* Singleton class for managing events subscription for the scopes */
	constructor(store) {
        if(!instance){
            instance = this;

            this.store = store;
            this.connector = new Connector();

            this.registered_projects_uuids = [];

            this.connector.after_connected((x) => {
            	this.emitter = new ScopesSocketioEventsEmitter();
            	this.emitter.renewScopes();
            });
        }

        return instance;
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all scopes in one message
		this.register_socketio_handler('scopes:all:get:back', renewScopes);

	}

	register_project_new_scope(project_uuid) {
		/* This thing MUST be called on each new project */
		this.register_socketio_handler('scopes:create:' + project_uuid, createScope);
	}

	register_project_delete_scope(project_uuid) {
		/* This thing MUST be called on each new project */
		this.register_socketio_handler('scopes:delete:' + project_uuid, deleteScope);
	}

	register_project_specific_scope_tracker(project_uuid) {
		if (this.registered_projects_uuids.indexOf(project_uuid) === -1) {
			this.registered_projects_uuids.push(project_uuid);

			this.register_project_new_scope(project_uuid);
			this.register_project_delete_scope(project_uuid);
		}
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x));
		});
	}
}

export default ScopesEventsSubsriber;