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

		var { ips, hosts, update_needed } = this.props.scopes;

		if (update_needed === true) {
			this.scopesEmitter.requestRenewScopes(this.props.project_uuid,
				ips.page, ips.page_size, hosts.page, hosts.page_size);
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
			this.setLoading(true);
			this.scopesEmitter.requestRenewScopes(
				this.props.project_uuid, ips.page, ips.page_size,
				hosts.page, hosts.page);
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