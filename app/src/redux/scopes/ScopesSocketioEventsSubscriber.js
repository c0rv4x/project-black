import { 
	createScope
} from './actions';

import Connector from '../SocketConnector.jsx';


class ScopesSocketioEventsSubscriber {
	/* Singleton class for managing events subscription for the scopes */
	constructor(store, project_uuid) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('scopes');

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all scopes in one message
		this.register_socketio_handler('scopes:create', createScope);
	}

	register_socketio_handler(eventName, dispatchCallback, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (data) => {
            this.store.dispatch(dispatchCallback(data, this.project_uuid));
		});
	}

    close() {
        this.connector.close();
    }	
}

export default ScopesSocketioEventsSubscriber;
