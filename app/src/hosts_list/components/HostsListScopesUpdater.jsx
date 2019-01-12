import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';

import HostsList from './HostsList.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter.js'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'
import { setLoaded } from '../../redux/hosts/actions.js'
import Loading from '../../common/loading/Loading.jsx'


class HostsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.triggerSetLoaded = this.triggerSetLoaded.bind(this);
		this.renewHosts = this.renewHosts.bind(this);
		this.renewCreds = this.renewCreds.bind(this);
		this.renewFiles = this.renewFiles.bind(this);
		this.requestUpdateHost = this.requestUpdateHost.bind(this);
	}

	componentDidMount() {
		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.credsEmitter = new CredsSocketioEventsEmitter();
		this.filesEmitter = new FilesSocketioEventsEmitter();

		if (this.props.hosts.update_needed === true) {
			this.renewHosts();
			// TODO: not sure if files is needed here. IPs list manage 
			// to work without one
			this.renewFiles();
		}
		else {
			this.renewCreds();
			this.renewFiles();
		}
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	triggerSetLoaded(value) {
		this.context.store.dispatch(setLoaded({
			'status': 'success',
			'value': value,
			'project_uuid': String(this.props.project_uuid)
		}, String(this.props.project_uuid)));
	}

	renewHosts(page=this.props.hosts.page, page_size=this.props.hosts.page_size, filters=this.props.filters) {
		this.hostsEmitter.requestRenewHosts(this.props.project_uuid, filters, page, this.props.hosts.page_size);
	}

	renewCreds(hosts=this.props.hosts.data) {
		this.credsEmitter.renewCreds(this.props.project_uuid, hosts.map((host) => {return host.hostname}));
	}

	renewFiles(hosts=this.props.hosts.data) {
		this.filesEmitter.requestStatsHost(this.props.project_uuid, hosts.map((host) => {return host.host_id}));
	}

	requestUpdateHost(comment, _id) {
		this.hostsEmitter.requestUpdateHost(comment, _id, this.props.project_uuid, "host");
	}

	componentDidUpdate(prevProps) {
		var { hosts, filters } = this.props;

		if (hosts.update_needed === true) {
			if (hosts.loaded) {
				this.triggerSetLoaded(false);
				this.renewHosts(hosts.page, hosts.page_size, filters);
			}
		}
		else {
			if ((prevProps.hosts.update_needed === true) || (!_.isEqual(hosts.data, prevProps.hosts.data))) {
				this.renewCreds();
				this.renewFiles();
			}
			if (!_.isEqual(filters, prevProps.filters)) {
				this.triggerSetLoaded(false);
				this.renewHosts(0, hosts.page_size, filters);
			}
		}
	}

	render() {
		return (
			<div>
				<Loading
					componentLoading={!this.props.hosts.loaded}
				>
				<HostsList
					triggerSetLoaded={this.triggerSetLoaded}
					renewHosts={this.renewHosts}
					requestUpdateHost={this.requestUpdateHost}
					{...this.props} />
				</Loading>
			</div>
		)
	}
}

HostsListScopesUpdater.contextTypes = {
    store: PropTypes.object
}

export default HostsListScopesUpdater;