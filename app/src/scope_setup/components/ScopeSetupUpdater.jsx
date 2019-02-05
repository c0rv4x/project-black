import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import ScopeSetup from './ScopeSetup.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'

import { requestIPs } from '../../redux/ips/actions.js'


class ScopeSetupUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		}

		this.setLoading = this.setLoading.bind(this);
	}

	componentDidMount() {
		this.hostsEmitter = new HostsSocketioEventsEmitter();

		if (this.props.hosts.update_needed === true) {
			this.context.store.dispatch(requestIPs(this.props.project_uuid));
			this.hostsEmitter.requestRenewHosts(this.props.project_uuid);
		}
	}

	setLoading(value) {
		this.setState({
			loading: value
		});
	}

	componentWillReceiveProps(nextProps) {
		var { hosts } = nextProps;

		if (hosts.update_needed === true) {
			this.setLoading(true);
			this.context.store.dispatch(requestIPs(this.props.project_uuid));
			this.hostsEmitter.requestRenewHosts(this.props.project_uuid);
		}

		if (this.state.loading) {
			this.setLoading(false);
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