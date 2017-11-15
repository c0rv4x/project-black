import Notifications from 'react-notification-system-redux'

import { 
	renewScans, 
} from './actions';

import Connector from '../SocketConnector.jsx';
import ScansSocketioEventsEmitter from './ScansSocketioEventsEmitter.js';

let instance = null;

class ScansEventsSubsriber {
	/* Singleton class for managing events subscription for the projects */
	constructor(store, project_uuid) {
        if(!instance){
            instance = this;

            this.store = store;
            this.project_uuid = project_uuid;
            this.connector = new Connector('scans');

            this.basic_events_registration();
        }

        return instance;
	}

	basic_events_registration() {
		/* Register handlers on basic events */

		// Received all projects in one message
		this.register_socketio_handler('scans:part:set', renewScans);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			if (x.status == 'success') {
				this.store.dispatch(callback(x, this.project_uuid));
			}
			else {
				this.store.dispatch(Notifications.error({
					title: 'Error with updating scans',
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
