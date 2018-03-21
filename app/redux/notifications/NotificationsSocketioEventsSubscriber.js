import { notificationSend } from './actions';

import Connector from '../SocketConnector.jsx';


class NotificationsSocketioEventsSubscriber {
	/* Class for managing events subscription for the projects */
	constructor(store, project_uuid=null) {
        this.store = store;
        this.connector = new Connector('notifications');

        this.project_uuid = project_uuid;

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */

        // Received all projects in one message
		this.register_socketio_handler('notification:new', (message) => {
            let { status, title, text, project_uuid } = message;

            if (((this.project_uuid === null) && (project_uuid === null)) || (project_uuid == this.project_uuid)) {
                notificationSend({
                    message: message.text,
                    kind: message.status.toLowerCase(),
                    dismissAfter: 25000
                })(this.store.dispatch);
            }
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
