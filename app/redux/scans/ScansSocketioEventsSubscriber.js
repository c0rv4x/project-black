import Notifications from 'react-notification-system-redux'

import { 
	renewStats, 
} from './actions';

import Connector from '../SocketConnector.jsx';
import ScansSocketioEventsEmitter from './ScansSocketioEventsEmitter.js';


class ScansEventsSubsriber {
	constructor(store, project_uuid) {
        this.store = store;
        this.connector = new Connector('scans');

        this.project_uuid = project_uuid;

        this.connector.after_connected((x) => {
        	this.emitter = new ScansSocketioEventsEmitter();
        	this.emitter.renewStats(this.project_uuid);
        });

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */

		this.register_socketio_handler('scans:stats:set', renewStats);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			if (x.status == 'success') {
				this.store.dispatch(callback(x, this.project_uuid));
			}
			else {
				this.store.dispatch(Notifications.error({
					title: 'Error on scans',
					message: x.text
				}));
			}
		});
	}

    close() {
        this.connector.close();
    }	
}

export default ScansEventsSubsriber;
