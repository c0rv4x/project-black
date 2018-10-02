import _ from 'lodash'
import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import ProjectDetails from './ProjectDetails.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import { setLoaded } from '../../redux/ips/actions.js'

class ProjectDetailsScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.ipsEmitter = new IPsSocketioEventsEmitter();
		this.triggerSetLoaded = this.triggerSetLoaded.bind(this);
		this.renewIps = this.renewIps.bind(this);

		if (this.props.ips.update_needed === true) {
			this.renewIps();
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
		else if (!_.isEqual(filters, prevProps.filters)) {
			this.triggerSetLoaded(false);
			this.renewIps(0, filters);
		}
	}

	render() {
		return (
			<Segment vertical>
				<Dimmer active={!this.props.ips.loaded} inverted>
					<Loader />
				</Dimmer>			
				<ProjectDetails
					setLoaded={this.triggerSetLoaded}
					renewIps={this.renewIps}
					{...this.props}
				/>
			</Segment>
		)
	}
}

ProjectDetailsScopesUpdater.contextTypes = {
    store: React.PropTypes.object
}

export default ProjectDetailsScopesUpdater;