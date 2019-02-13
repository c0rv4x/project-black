import { 
	resolveFinished,
	hostCommentUpdated,
	hostsCreated,
	hostDeleted,
	hostsDataUpdated,
	IPsInHostsUpdated
} from './actions';

import Connector from '../SocketConnector.jsx';


class HostsSocketioEventsSubscriber {
	constructor(store, project_uuid) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('hosts');

        this.basic_events_registration();
	}

	basic_events_registration() {
		this.register_socketio_handler('host:comment_updated', hostCommentUpdated);
		this.register_socketio_handler('hosts:created', hostsCreated);
		this.register_socketio_handler('host:deleted', hostDeleted);
		this.register_socketio_handler('hosts:updated', hostsDataUpdated);
		this.register_socketio_handler('hosts:updated:ips', IPsInHostsUpdated);

		this.register_socketio_handler('hosts:resolve:done', resolveFinished);

	}

	register_socketio_handler(eventName, dispatchCallback) {
		this.connector.listen(eventName, (data) => {
			this.store.dispatch(dispatchCallback(data, this.project_uuid));
		});
	}

    close() {
        this.connector.close();
    }	
}

export default HostsSocketioEventsSubscriber;
