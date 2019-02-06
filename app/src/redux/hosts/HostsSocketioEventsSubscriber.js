import Notifications from 'react-notification-system-redux'

import { 
	createHost, 
	deleteHost,
	renewHosts,
	updateHost,
	resolveHosts,
	updatedIPs,
	hostsDataUpdated,
	getTasksByHosts
} from './actions';

import Connector from '../SocketConnector.jsx';


class HostsSocketioEventsSubscriber {
	/* Singleton class for managing events subscrhosttion for the hosts */
	constructor(store, project_uuid, hostname=null, filters={}, pageSize=12) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('hosts');

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all hosts in one message
		this.register_socketio_handler('hosts:part:set', renewHosts);

		this.register_socketio_handler('hosts:update:back', updateHost);
		this.register_socketio_handler('hosts:updated:ips', updatedIPs);
		this.register_socketio_handler('hosts:updated', hostsDataUpdated);
		this.register_socketio_handler('hosts:create', createHost);
		this.register_socketio_handler('hosts:delete', deleteHost);
		this.register_socketio_handler('hosts:resolve:done', resolveHosts);
		this.register_socketio_handler('hosts:get:tasks:back', getTasksByHosts);

	}

	register_socketio_handler(eventName, dispatchCallback, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (data) => {
			if (data.status == 'success') {
				this.store.dispatch(dispatchCallback(data, this.project_uuid));
			}
			else {
				this.store.dispatch(Notifications.error({
					title: 'Error with hosts',
					message: data.text
				}));
			}				
		});
	}

    close() {
        this.connector.close();
    }	
}

export default HostsSocketioEventsSubscriber;
