import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import ScopeSetup from './ScopeSetup.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'

import { requestIPs } from '../../redux/ips/actions.js'


class ScopeSetupUpdater extends React.Component {
	componentDidMount() {
		this.hostsEmitter = new HostsSocketioEventsEmitter();

		if (this.props.hosts.update_needed === true) {
			this.context.store.dispatch(requestIPs(this.props.project_uuid));
			this.hostsEmitter.requestRenewHosts(this.props.project_uuid);
		}
	}

	componentWillReceiveProps(nextProps) {
		var { hosts } = nextProps;

		if (hosts.update_needed === true) {
			this.context.store.dispatch(requestIPs(this.props.project_uuid));
			this.hostsEmitter.requestRenewHosts(this.props.project_uuid);
		}
		
	}

	render() {
		return (
			<ScopeSetup {...this.props} />
		)
	}
}

ScopeSetupUpdater.contextTypes = {
    store: PropTypes.object
}

export default ScopeSetupUpdater;