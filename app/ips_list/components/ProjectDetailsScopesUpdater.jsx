import _ from 'lodash'
import React from 'react'
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

import ProjectDetails from './ProjectDetails.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'


class ProjectDetailsScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false
		}

		this.ipsEmitter = new IPsSocketioEventsEmitter();
		this.setLoading = this.setLoading.bind(this);

		var { ips } = this.props;

		if (this.props.update_needed === true) {
			this.ipsEmitter.requestRenewIPs(
				this.props.project_uuid, this.props.filters, ips.ip_page, ips.ip_page_size);
		}
	}

	setLoading(value) {
		this.setState({
			loading: value
		});
	}

	componentWillReceiveProps(nextProps) {
		var { ips, filters } = nextProps;

		if ((ips.update_needed === true) || (!_.isEqual(filters, this.props.filters))) {
			this.ipsEmitter.requestRenewIPs(
				this.props.project.project_uuid, filters, ips.page, ips.page_size);
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
				<ProjectDetails setLoading={this.setLoading} {...this.props} />
			</Segment>
		)
	}
}

export default ProjectDetailsScopesUpdater;