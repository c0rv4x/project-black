import { showNotification } from './actions';

import Connector from '../SocketConnector.jsx';


class NotificationsSocketioEventsSubscriber {
	/* Class for managing events subscription for the projects */
	constructor(store) {
        this.store = store;
        this.connector = new Connector('notifications');

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */

        // Received all projects in one message
		this.register_socketio_handler('notification:new', (message) => {
            let status, title, text = { message };
            showNotification({
                header: "test",
                message: "test"
            })(this.store.dispatch);
        });
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, callback);
	}

    close() {
        this.connector.close();
    }	
}

export default NotificationsSocketioEventsSubscriber;
