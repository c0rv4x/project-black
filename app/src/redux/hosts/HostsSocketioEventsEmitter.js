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

	requestSingleHost(project_uuid, hostname) {
		this.connector.emit('hosts:single:get', {
			'project_uuid': project_uuid,
			'hostname': hostname
		});		
	}

	requestUpdateHost(comment, host_id, project_uuid, host_type) {
		this.connector.emit('hosts:update', {
			'host_id': host_id,
			'comment': comment,
			'project_uuid': project_uuid,
			'host_type': host_type
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
