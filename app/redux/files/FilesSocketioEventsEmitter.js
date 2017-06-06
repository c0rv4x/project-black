import Connector from '../SocketConnector.jsx';


class FilesSocketioEventsEmitter {
    /* Singleton class for managing events subscription for the files */
    constructor() {
        this.connector = new Connector('files');
    }

    renewFiles() {
        this.connector.emit('files:all:get');
    }

}

export default FilesSocketioEventsEmitter;
