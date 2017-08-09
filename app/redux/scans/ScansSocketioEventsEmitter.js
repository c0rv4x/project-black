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

	renewScans(project_uuid) {
		this.connector.emit('scans:all:get', {
			"project_uuid": project_uuid
		});
	}

}

export default ScansSocketioEventsEmitter;
