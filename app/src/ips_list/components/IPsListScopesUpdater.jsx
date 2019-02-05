import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';

import IPsList from './IPsList.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter.js'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'
import { setLoaded } from '../../redux/ips/actions.js'
import Loading from '../../common/loading/Loading.jsx'

import { flushAndRequestIPs } from '../../redux/ips/actions.js'

class IPsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.triggerSetLoaded = this.triggerSetLoaded.bind(this);
		this.renewIps = this.renewIps.bind(this);
		this.renewCreds = this.renewCreds.bind(this);
		this.renewFiles = this.renewFiles.bind(this);
	}

	triggerSetLoaded(value) {
		this.context.store.dispatch(setLoaded({
			'status': 'success',
			'value': value,
			'project_uuid': String(this.props.project_uuid)
		}, String(this.props.project_uuid)));
	}

	renewIps(ip_page=this.props.ips.page, filters=this.props.filters) {
		let { ips, project_uuid } = this.props;

		this.context.store.dispatch(flushAndRequestIPs(project_uuid, filters, ip_page, ips.page_size));
	}

	renewCreds(ips=this.props.ips.data) {
		this.credsEmitter.renewCreds(this.props.project_uuid, ips.map((ip) => {return ip.ip_address}));
	}

	renewFiles(ips=this.props.ips.data) {
		this.filesEmitter.requestStatsIPs(this.props.project_uuid, ips.map((ip) => {return ip.ip_id}));
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	componentDidUpdate(prevProps) {
		let { ips, filters } = this.props;

		if (!_.isEqual(filters, prevProps.filters)) {
			this.triggerSetLoaded(false);
			this.renewIps(0, filters);
		}
	}

	render() {
		return (
			<div>
				<Loading
					componentLoading={!this.props.ips.loaded}
				>
					<IPsList
						setLoaded={this.triggerSetLoaded}
						renewIps={this.renewIps}
						{...this.props}
					/>
				</Loading>
			</div>
		)
	}
}

IPsListScopesUpdater.contextTypes = {
    store: PropTypes.object
}

export default IPsListScopesUpdater;