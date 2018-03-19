import Notifications from 'react-notification-system-redux'

import Connector from '../SocketConnector.jsx';
import Notifier from '../../common/notifications/notifier.js';


class NotificationsSocketioEventsSubscriber {
	/* Class for managing events subscription for the projects */
	constructor(store) {
        this.store = store;
        this.connector = new Connector('notifications');

        this.notifier = new Notifier(store);

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */

        // Received all projects in one message
        console.log('registered handler');
		this.register_socketio_handler('notification:new', (message) => {
            let status, title, text = { message };
            console.log(message);

            this.notifier[status](title, text);
        });
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
            this.store.dispatch(Notifications.error({
                title: x.title,
                message: x.message
            }));
		});
	}

    close() {
        this.connector.close();
    }	
}

export default NotificationsSocketioEventsSubscriber;
