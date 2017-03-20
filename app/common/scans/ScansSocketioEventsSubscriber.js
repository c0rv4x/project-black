import { 
	renewScans, 
} from './actions';

import Connector from '../SocketConnector.jsx';
import ScansSocketioEventsEmitter from './ScansSocketioEventsEmitter.js';

let instance = null;

class ScansEventsSubsriber {
	/* Singleton class for managing events subscription for the projects */
	constructor(store) {
        if(!instance){
            instance = this;

            this.store = store;
            this.connector = new Connector();

            this.connector.after_connected((x) => {
            	this.emitter = new ScansSocketioEventsEmitter();
            	this.emitter.renewScans();
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
}

export default ScansEventsSubsriber;