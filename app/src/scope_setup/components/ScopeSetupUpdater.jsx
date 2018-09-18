import _ from 'lodash'
import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import ScopeSetup from './ScopeSetup.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'


class ScopeSetupUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		}

		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.ipsEmitter = new IPsSocketioEventsEmitter();
		this.setLoading = this.setLoading.bind(this);

		if (this.props.hosts.update_needed === true) {
			this.ipsEmitter.requestRenewIPs(this.props.project_uuid);
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
			this.ipsEmitter.requestRenewIPs(this.props.project_uuid);
			this.hostsEmitter.requestRenewHosts(this.props.project_uuid);
		}

		if (this.state.loading) {
			this.setLoading(false);
		}
		
	}

	render() {
		return (
			<Segment vertical>
				<Dimmer active={this.state.loading} inverted>
					<Loader />
				</Dimmer>				
				<ScopeSetup {...this.props} />
			</Segment>
		)
	}
}

export default ScopeSetupUpdater;