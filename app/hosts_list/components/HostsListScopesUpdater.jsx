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
		this.requestUpdateHost = this.requestUpdateHost.bind(this);
	}

	setLoading(value) {
		this.setState({
			loading: value
		});
	}

	renewHosts(page=this.props.hosts.page, page_size=this.props.hosts.page_size, filters=this.props.filters) {
		this.hostsEmitter.requestRenewHosts(this.props.project_uuid, filters, page, this.props.hosts.page_size);
	}

	requestUpdateHost(comment, _id) {
		this.hostsEmitter.requestUpdateHost(comment, _id, this.props.project_uuid, "host");
	}

	componentWillReceiveProps(nextProps) {
		var { hosts, filters } = nextProps;

		if (hosts.update_needed === true) {
			this.renewHosts(hosts.page, hosts.page_size, filters);
		}
		else if (!_.isEqual(filters, this.props.filters)) {
			this.renewHosts(0, hosts.page_size, filters);
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
						   requestUpdateHost={this.requestUpdateHost}
						   {...this.props} />
			</Segment>
		)
	}
}

export default HostsListScopesUpdater;