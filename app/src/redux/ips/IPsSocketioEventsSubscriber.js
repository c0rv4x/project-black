import Notifications from 'react-notification-system-redux'

import { 
	IPsCreated, 
	IPDeleted,
	IPCommentUpdated,
	updatedIPs,
} from './actions';

import Connector from '../SocketConnector.jsx';


class IPsSocketioEventsSubscriber {
	/* Singleton class for managing events subscription for the ips */
	constructor(store, project_uuid, ip_address=null, filters={}, pageSize=12) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('ips');

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all ips in one message
		this.register_socketio_handler('ip:comment_updated', IPCommentUpdated);
		this.register_socketio_handler('ips:created', IPsCreated);
		this.register_socketio_handler('ip:deleted', IPDeleted);

		// Old handlers which might still be useful
		this.register_socketio_handler('ips:updated', updatedIPs);
	}

	register_socketio_handler(eventName, dispatchCallback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (data) => {
			this.store.dispatch(dispatchCallback(data, this.project_uuid));
		});
	}

    close() {
        this.connector.close();
    }	
}

export default IPsSocketioEventsSubscriber;
