import Connector from '../SocketConnector.jsx';


class CredsSocketioEventsEmitter {
    /* Singleton class for managing events subscription for the files */
    constructor() {
        this.connector = new Connector('creds');
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
