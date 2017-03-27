import { 
	createScope, 
	deleteScope,
	renewScopes,
	updateScope
} from './actions';

import Connector from '../SocketConnector.jsx';
import ScopesSocketioEventsEmitter from './ScopesSocketioEventsEmitter.js';


class ScopesSocketioEventsSubscriber {
	/* Singleton class for managing events subscription for the scopes */
	constructor(store) {
        this.store = store;
        this.connector = new Connector();

        this.connector.after_connected((x) => {
        	this.emitter = new ScopesSocketioEventsEmitter();
        	this.emitter.requestRenewScopes();
        });

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all scopes in one message
		this.register_socketio_handler('scopes:all:get:back', renewScopes);
		this.register_socketio_handler('scopes:update:back', updateScope);
		this.register_project_new_scope();
		this.register_project_delete_scope();
	}

	register_project_new_scope() {
		/* Check new scope */
		this.register_socketio_handler('scopes:create', createScope);
	}

	register_project_delete_scope() {
		/* Check deleted scope */
		this.register_socketio_handler('scopes:delete', deleteScope);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x));
		});
	}
}

export default ScopesSocketioEventsSubscriber;