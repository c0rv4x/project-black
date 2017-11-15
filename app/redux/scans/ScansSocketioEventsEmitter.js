import Connector from '../SocketConnector.jsx';


let instance = null;

class ScansSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the scans */
	constructor() {
        if(!instance){
            instance = this;

            this.connector = new Connector('scans');
        }

        return instance;
	}

	renewScans(project_uuid, ips) {
		this.connector.emit('scans:part:get', {
			"project_uuid": project_uuid,
			"ips": ips
		});
	}

}

export default ScansSocketioEventsEmitter;
