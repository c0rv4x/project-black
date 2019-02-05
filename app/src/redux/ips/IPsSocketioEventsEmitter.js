import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


class IPsSocketioEventsEmitter {
	/* Singleton class for managing events subscription for the ips */
	constructor() {
        this.connector = new Connector('ips');
	}

	requestUpdateIP(comment, ip_id, project_uuid, ip_type) {
		this.connector.emit('ips:update', {
			'ip_id': ip_id,
			'comment': comment,
			'project_uuid': project_uuid,
			'ip_type': ip_type
		});
	}

	requestTasksByIps(ips, project_uuid) {
		this.connector.emit('ips:get:tasks', {
			'project_uuid': project_uuid,
			'ips': ips
		});
	}	

}

export default IPsSocketioEventsEmitter;
