import _ from 'lodash'
import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import HostsList from './HostsList.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import { setLoaded } from '../../redux/hosts/actions.js'


class HostsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.triggerSetLoaded = this.triggerSetLoaded.bind(this);

		var { hosts } = this.props;

		if (hosts.update_needed === true) {
			this.renewHosts(hosts.page, hosts.page_size);
		}

		this.renewHosts = this.renewHosts.bind(this);
		this.requestUpdateHost = this.requestUpdateHost.bind(this);
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

	requestUpdateHost(comment, _id) {
		this.hostsEmitter.requestUpdateHost(comment, _id, this.props.project_uuid, "host");
	}

	componentDidUpdate(nextProps) {
		var { hosts, filters } = nextProps;

		if (hosts.update_needed === true) {
			this.triggerSetLoaded(false);
			this.renewHosts(hosts.page, hosts.page_size, filters);
		}
		else if (!_.isEqual(filters, this.props.filters)) {
			this.triggerSetLoaded(false);
			this.renewHosts(0, hosts.page_size, filters);
		}

		// if (!this.props.hosts.loaded) {
		// 	setTimeout(() => this.triggerSetLoaded(true), 300);
		// }
	}

	render() {
		return (
			<Segment vertical>
				<Dimmer active={!this.props.hosts.loaded} inverted>
					<Loader />
				</Dimmer>			
				<HostsList triggerSetLoaded={this.triggerSetLoaded}
						   renewHosts={this.renewHosts}
						   requestUpdateHost={this.requestUpdateHost}
						   {...this.props} />
			</Segment>
		)
	}
}

HostsListScopesUpdater.contextTypes = {
    store: React.PropTypes.object
}

export default HostsListScopesUpdater;