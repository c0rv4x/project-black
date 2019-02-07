import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';

import HostsList from './HostsList.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter.js'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'
import { setLoaded } from '../../redux/hosts/actions.js'
import Loading from '../../common/loading/Loading.jsx'

import { flushAndRequestHosts } from '../../redux/hosts/actions.js'


class HostsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

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

	renewHosts(page=this.props.hosts.page, page_size=this.props.hosts.page_size, filters=this.props.filters) {
		this.context.store.dispatch(flushAndRequestHosts(this.props.project_uuid, filters, page, this.props.hosts.page_size));
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

		if (!_.isEqual(filters, prevProps.filters)) {
			this.renewHosts(0, hosts.page_size, filters);
		}
	}

	render() {
		return (
			<div>
				<Loading
					componentLoading={!this.props.hosts.loaded}
				>
				<HostsList
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