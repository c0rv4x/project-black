import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


class HostsSocketioEventsEmitter {
	constructor() {
        this.connector = new Connector('hosts');
	}

	requestResolveHosts(hosts_ids, project_uuid) {
		this.connector.emit('hosts:resolve', {
			'hosts_ids': hosts_ids,
			'project_uuid': project_uuid
		});
	}

}

export default HostsSocketioEventsEmitter;
