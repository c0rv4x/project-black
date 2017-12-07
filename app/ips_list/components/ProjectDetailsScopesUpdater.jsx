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
		this.renewIps = this.renewIps.bind(this);

		if (this.props.update_needed === true) {
			this.renewIps();
		}
	}

	setLoading(value) {
		this.setState({
			loading: value
		});
	}

	renewIps(ip_page=this.props.ips.page, filters=this.props.filters) {
		var { ips } = this.props;

		console.log(this.props.project.project_uuid, this.props.filters, ip_page, ips.page_size);

		this.ipsEmitter.requestRenewIPs(this.props.project.project_uuid, filters, ip_page, ips.page_size);
	}

	componentWillReceiveProps(nextProps) {
		var { ips, filters } = nextProps;

		if ((ips.update_needed === true) || (!_.isEqual(filters, this.props.filters))) {
			this.renewIps(nextProps.ips.page, filters);
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
				<ProjectDetails setLoading={this.setLoading}
								renewIps={this.renewIps}
								{...this.props} />
			</Segment>
		)
	}
}

export default ProjectDetailsScopesUpdater;