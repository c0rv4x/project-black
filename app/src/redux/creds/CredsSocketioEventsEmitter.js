import Connector from '../SocketConnector.jsx';


class CredsSocketioEventsEmitter {
    /* Singleton class for managing events subscription for the files */
    constructor() {
        this.connector = new Connector('creds');
    }

    renewStats(project_uuid) {
        this.connector.emit('creds:stats:get', {
            "project_uuid": project_uuid
        });
    }

    renewCreds(project_uuid, targets) {
        this.connector.emit('creds:get', {
            "project_uuid": project_uuid,
            "targets": targets
        });        
    }
}

export default CredsSocketioEventsEmitter;
