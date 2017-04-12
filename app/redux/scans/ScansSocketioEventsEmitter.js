import Connector from '../SocketConnector.jsx';


let instance = null;

class ScansSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the scans */
	constructor() {
        if(!instance){
            instance = this;

            this.connector = new Connector();
        }

        return instance;
	}

	renewScans() {
		this.connector.emit('scans:all:get');
	}

}

export default ScansSocketioEventsEmitter;
