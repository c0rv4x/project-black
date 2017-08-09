import Connector from '../SocketConnector.jsx';


class FilesSocketioEventsEmitter {
    /* Singleton class for managing events subscription for the files */
    constructor() {
        this.connector = new Connector('files');
    }

    renewFiles(project_uuid) {
        this.connector.emit('files:all:get', {
        	"project_uuid": project_uuid
        });
    }

}

export default FilesSocketioEventsEmitter;
