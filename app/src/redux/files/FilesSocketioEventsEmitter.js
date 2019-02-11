import Connector from '../SocketConnector.jsx';


class FilesSocketioEventsEmitter {
    /* Singleton class for managing events subscription for the files */
    constructor() {
        this.connector = new Connector('files');
    }

    requestFilesIps(project_uuid, ip, port_number, limit, offset, filters) {
        this.connector.emit('files:get:ips', {
            "project_uuid": project_uuid,
            "ip": ip,
            "port_number": port_number,
            "limit": limit,
            "offset": offset,
            "filters": filters
        });
    }
}

export default FilesSocketioEventsEmitter;
