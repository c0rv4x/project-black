import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import IPsList from './IPsList.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import CredsSocketioEventsEmitter from '../../redux/creds/CredsSocketioEventsEmitter.js'
import { setLoaded } from '../../redux/ips/actions.js'

class IPsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.ipsEmitter = new IPsSocketioEventsEmitter();
		this.credsEmitter = new CredsSocketioEventsEmitter();

		this.triggerSetLoaded = this.triggerSetLoaded.bind(this);
		this.renewIps = this.renewIps.bind(this);
		this.renewCreds = this.renewCreds.bind(this);

		if (this.props.ips.update_needed === true) {
			this.renewIps();
		}
		else {
			// console.log("Constructor renewing creds");
			this.renewCreds();
		}
	}

	triggerSetLoaded(value) {
		this.context.store.dispatch(setLoaded({
			'status': 'success',
			'value': value,
			'project_uuid': String(this.props.project.project_uuid)
		}, String(this.props.project.project_uuid)));
	}

	renewIps(ip_page=this.props.ips.page, filters=this.props.filters) {
		var { ips } = this.props;

		this.ipsEmitter.requestRenewIPs(this.props.project.project_uuid, filters, ip_page, ips.page_size);
	}

	renewCreds(ips=this.props.ips.data) {
		this.credsEmitter.renewCreds(this.props.project.project_uuid, ips.map((ip) => {return ip.ip_address}));
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	componentDidUpdate(prevProps) {
		var { ips, filters } = this.props;

		if (ips.update_needed === true) {
			if (ips.loaded) {
				this.triggerSetLoaded(false);
				this.renewIps(this.props.ips.page, filters);
			}
		}
		else {
			if ((prevProps.ips.update_needed === true) || (!_.isEqual(ips.data, prevProps.ips.data))) {
				// console.log("componentdidupdate is renewing creds");
				this.renewCreds();
			}

			if (!_.isEqual(filters, prevProps.filters)) {
				this.triggerSetLoaded(false);
				this.renewIps(0, filters);
			}
		}
	}

	render() {
		return (
			<Segment vertical>
				<Dimmer active={!this.props.ips.loaded} inverted>
					<Loader />
				</Dimmer>			
				<IPsList
					setLoaded={this.triggerSetLoaded}
					renewIps={this.renewIps}
					{...this.props}
				/>
			</Segment>
		)
	}
}

IPsListScopesUpdater.contextTypes = {
    store: PropTypes.object
}

export default IPsListScopesUpdater;