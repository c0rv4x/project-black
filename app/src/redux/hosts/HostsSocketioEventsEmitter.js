import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


class HostsSocketioEventsEmitter {
	/* Singleton class for managing events subscrhosttion for the hosts */
	constructor() {
        this.connector = new Connector('hosts');
	}

	requestResolveHosts(hosts_ids, project_uuid) {
		this.connector.emit('hosts:resolve', {
			'hosts_ids': hosts_ids,
			'project_uuid': project_uuid
		});
	}

	requestTasksByHosts(hosts, project_uuid) {
		this.connector.emit('hosts:get:tasks', {
			'project_uuid': project_uuid,
			'hosts': hosts
		});		
	}

}

export default HostsSocketioEventsEmitter;
