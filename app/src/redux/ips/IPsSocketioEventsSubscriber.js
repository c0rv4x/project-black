import Notifications from 'react-notification-system-redux'

import { 
	createIP, 
	deleteIP,
	renewIPs,
	updateIP,
	updatedIPs,
	resolveIPs,
	getByIps,
	requestIPs
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
		this.register_socketio_handler('ips:part:set', renewIPs);

		this.register_socketio_handler('ips:update:back', updateIP);
		this.register_socketio_handler('ips:create', createIP);
		this.register_socketio_handler('ips:delete', deleteIP);
		this.register_socketio_handler('ips:updated', updatedIPs);

		/* This handler receives tasks for current ips */
		this.register_socketio_handler('ips:get:tasks:back', getByIps);
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
