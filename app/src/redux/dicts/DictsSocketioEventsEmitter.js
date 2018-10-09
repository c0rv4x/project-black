import Connector from '../SocketConnector.jsx';


class CredsSocketioEventsEmitter {
    /* Singleton class for managing events subscription for the files */
    constructor() {
        this.connector = new Connector('dicts');
    }

    getDicts(project_uuid) {
        this.connector.emit('dicts:get', {
            "project_uuid": project_uuid
        });
    }
}

export default CredsSocketioEventsEmitter;
