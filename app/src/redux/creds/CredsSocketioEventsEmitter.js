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

    deleteCreds(project_uuid, target, port_number) {
        this.connector.emit('creds:delete', {
            "project_uuid": project_uuid,
            "targets": [target],
            "port_number": port_number
        });    
    }
}

export default CredsSocketioEventsEmitter;
