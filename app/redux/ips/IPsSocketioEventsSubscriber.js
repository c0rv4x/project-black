import Notifications from 'react-notification-system-redux'

import { 
	createIP, 
	deleteIP,
	renewIPs,
	updateIP,
	updatedIPs,
	resolveIPs
} from './actions';

import Connector from '../SocketConnector.jsx';
import IPsSocketioEventsEmitter from './IPsSocketioEventsEmitter.js';


class IPsSocketioEventsSubscriber {
	/* Singleton class for managing events subscription for the ips */
	constructor(store, project_uuid, ip=null, filters={}) {
		console.log(filters);
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('ips');

        this.connector.after_connected((x) => {
        	this.emitter = new IPsSocketioEventsEmitter();

        	if (ip) {
	        	this.emitter.requestRenewIPs(this.project_uuid);
        	}
        	else {
	        	this.emitter.requestRenewIPs(this.project_uuid, filters);
        	}
        });

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
	}

	register_socketio_handler(eventName, dispatchCallback, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (data) => {
			console.log("Ips got event:", eventName);
			if (data.status == 'success') {
				this.store.dispatch(dispatchCallback(data, this.project_uuid));
			}
			else {
				this.store.dispatch(Notifications.error({
					title: 'Error with ips',
					message: data.text
				}));
			}				
		});
	}

    close() {
        this.connector.close();
    }	
}

export default IPsSocketioEventsSubscriber;
