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

            this.connector.after_connected((x) => {
            	this.emitter = new ScansSocketioEventsEmitter();
            	this.emitter.renewScans(this.project_uuid);
            });

            this.basic_events_registration();
        }

        return instance;
	}

	basic_events_registration() {
		/* Register handlers on basic events */

		// Received all projects in one message
		this.register_socketio_handler('scans:all:get:back', renewScans);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x));
		});
	}

    close() {
        this.connector.close();
    }	
}

export default ScansEventsSubsriber;
