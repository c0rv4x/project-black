import _ from 'lodash';
import Connector from '../SocketConnector.jsx';


class HostsSocketioEventsEmitter {
	/* Singleton class for managing events subscrhosttion for the hosts */
	constructor() {
        this.connector = new Connector('hosts');
	}

	requestDeleteHost(host_id, project_uuid, type) {
		this.connector.emit('hosts:delete:host_id', {
			'host_id': host_id,
			'project_uuid': project_uuid,
			'host_type': type
		});
	}

	requestResolveHosts(hosts_ids, project_uuid) {
		this.connector.emit('hosts:resolve', {
			'hosts_ids': hosts_ids,
			'project_uuid': project_uuid
		});
	}

	requestRenewHosts(project_uuid, host_filters={}, host_page=0, host_page_size=12) {
		this.connector.emit('hosts:part:get', {
			'project_uuid': project_uuid,
			'host_filters': host_filters,
			'host_page': host_page,
			'host_page_size': host_page_size			
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

}

export default HostsSocketioEventsEmitter;
