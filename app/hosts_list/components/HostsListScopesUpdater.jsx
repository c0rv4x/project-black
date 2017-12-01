import _ from 'lodash'
import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import HostsList from './HostsList.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'


class HostsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		}

		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.setLoading = this.setLoading.bind(this);

		var { hosts } = this.props;

		if (hosts.update_needed === true) {
			this.renewHosts(hosts.page, hosts.page_size);
		}

		this.renewHosts = this.renewHosts.bind(this);
	}

	setLoading(value) {
		this.setState({
			loading: value
		});
	}

	renewHosts(page, page_size) {
		this.hostsEmitter.requestRenewHosts(this.props.project_uuid, this.props.filters, page, page_size);
	}

	componentWillReceiveProps(nextProps) {
		var { hosts } = nextProps;

		if (hosts.update_needed === true) {
			this.setLoading(true);
			this.renewHosts(hosts.page, hosts.page_size);
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
				<HostsList setLoading={this.setLoading}
						   renewHosts={this.renewHosts}
						   {...this.props} />
			</Segment>
		)
	}
}

export default HostsListScopesUpdater;