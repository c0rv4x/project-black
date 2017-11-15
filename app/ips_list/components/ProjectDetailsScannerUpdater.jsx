import _ from 'lodash'
import React from 'react'

import ProjectDetails from './ProjectDetails.jsx'
import ScansSocketioEventsEmitter from '../../redux/scans/ScansSocketioEventsEmitter.js'


class ProjectDetailsScannerUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.requestScans.bind(this);
		this.scansEmitter = new ScansSocketioEventsEmitter();

		let inited = false;
		if (this.props.inited) {
			inited = true;

			this.requestScans();
		}

		this.state = {
			"inited": inited
		};
	}

	requestScans() {
		let { project_uuid, scopes } = this.props;
		let ips = scopes.ips.data.map((ip_address) => {
			return ip_address.ip_address;
		});

		this.scansEmitter.renewScans(project_uuid, ips);
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.ips, this.props.ips)) {
			this.requestScans();
		}
	}

	render() {
		return (
			<ProjectDetails {...this.props} />
		)
	}
}

export default ProjectDetailsScannerUpdater;