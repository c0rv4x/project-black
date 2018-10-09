import Notifications from 'react-notification-system-redux'

import { 
    setDicts
} from './actions';

import Connector from '../SocketConnector.jsx';
import DictsSocketioEventsEmitter from './DictsSocketioEventsEmitter';


class DictsEventsSubsriber {
    /* Singleton class for managing events subscription for the projects */
    constructor(store, project_uuid, hostname=null) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.hostname = hostname;
        this.connector = new Connector('dicts');

        this.connector.after_connected((x) => {
            this.emitter = new DictsSocketioEventsEmitter();

            this.emitter.getDicts(this.project_uuid);
        });

        this.basic_events_registration();
    }

    basic_events_registration() {
        /* Register handlers on basic events */

        this.register_socketio_handler('dicts:set', setDicts);
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

export default DictsEventsSubsriber;
