import _ from 'lodash'
import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import HostsList from './HostsList.jsx'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'


class HostsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		}

		this.scopesEmitter = new ScopesSocketioEventsEmitter();
		this.setLoading = this.setLoading.bind(this);

		var { ips, hosts } = this.props;

		if (this.props.update_needed === true) {
			this.scopesEmitter.requestRenewScopes(this.props.project_uuid,
				ip_page=ips.ip_page, ip_page_size=ips.ip_page_size, host_page=hosts.host_page, host_page_size=hosts.host_page);
		}
	}

	setLoading(value) {
		this.setState({
			loading: value
		});
	}

	componentWillReceiveProps(nextProps) {
		var { ips, hosts } = nextProps.scopes;

		if (nextProps.scopes.update_needed === true) {
			this.scopesEmitter.requestRenewScopes(
				this.props.project_uuid, ip_page=ips.ip_page, ip_page_size=ips.ip_page_size,
				host_page=hosts.host_page, host_page_size=hosts.host_page);
		}

		if ((hosts.page !== this.props.scopes.hosts.page) || (hosts.page_size !== this.props.scopes.hosts.page_size)
			|| (JSON.stringify(hosts.data) !== JSON.stringify(this.props.scopes.hosts.data))) {
			this.setLoading(false);
		}
	}

	render() {
		return (
			<Segment vertical>
				<Dimmer active={this.state.loading} inverted>
					<Loader />
				</Dimmer>			
				<HostsList setLoading={this.setLoading} {...this.props} />
			</Segment>
		)
	}
}

export default HostsListScopesUpdater;