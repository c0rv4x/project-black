import Notifications from 'react-notification-system-redux'

import { 
    renewCreds,
    renewCredsStats,
    deletedCreds
} from './actions';

import Connector from '../SocketConnector.jsx';
import CredsSocketioEventsEmitter from './CredsSocketioEventsEmitter';


class CredsEventsSubsriber {
    /* Singleton class for managing events subscription for the projects */
    constructor(store, project_uuid, hostname=null) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.hostname = hostname;
        this.connector = new Connector('creds');

        this.connector.after_connected((x) => {
            this.emitter = new CredsSocketioEventsEmitter();

            this.emitter.renewStats(this.project_uuid);
        });

        this.basic_events_registration();
    }

    basic_events_registration() {
        /* Register handlers on basic events */

        this.register_socketio_handler('creds:stats:set', renewCredsStats);
        this.register_socketio_handler('creds:get:back', renewCreds);
        this.register_socketio_handler('creds:delete:back', deletedCreds);
    }

    register_socketio_handler(eventName, callback) {
        /* Just a wrapper for connector.listen */
        this.connector.listen(eventName, (x) => {
            if (x.status == 'success') {
                this.store.dispatch(callback(x, this.project_uuid));
            }
            else {
                this.store.dispatch(Notifications.error({
                    title: 'Error with files updating',
                    message: x.text
                }));
            }
        });
    }

    close() {
        this.connector.close();
    }
}

export default CredsEventsSubsriber;
