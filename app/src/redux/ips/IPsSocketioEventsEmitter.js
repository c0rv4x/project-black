import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


class IPsSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the ips */
	constructor() {
        this.connector = new Connector('ips');
	}

	requestTasksByIps(ips, project_uuid) {
		this.connector.emit('ips:get:tasks', {
			'project_uuid': project_uuid,
			'ips': ips
		});
	}	

}

export default IPsSocketioEventsEmitter;
