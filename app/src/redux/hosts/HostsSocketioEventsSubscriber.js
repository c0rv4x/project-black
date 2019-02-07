import Notifications from 'react-notification-system-redux'

import { 
	resolveHosts,
	updatedIPs,
	getTasksByHosts,

	hostCommentUpdated,
	hostsCreated,
	hostDeleted
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
		this.register_socketio_handler('host:comment_updated', hostCommentUpdated);
		this.register_socketio_handler('hosts:created', hostsCreated);
		this.register_socketio_handler('host:deleted', hostDeleted);


		this.register_socketio_handler('hosts:updated:ips', updatedIPs);
		this.register_socketio_handler('hosts:resolve:done', resolveHosts);
		this.register_socketio_handler('hosts:get:tasks:back', getTasksByHosts);

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

export default HostsSocketioEventsSubscriber;
