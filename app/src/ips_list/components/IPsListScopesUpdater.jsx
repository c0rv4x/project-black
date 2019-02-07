import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';

import IPsList from './IPsList.jsx'
import Loading from '../../common/loading/Loading.jsx'

import { flushAndRequestIPs } from '../../redux/ips/actions.js'

class IPsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.renewIps = this.renewIps.bind(this);
		this.renewCreds = this.renewCreds.bind(this);
		this.renewFiles = this.renewFiles.bind(this);
	}

	renewIps(ip_page=this.props.ips.page, filters=this.props.filters) {
		let { ips, project_uuid } = this.props;

		this.context.store.dispatch(flushAndRequestIPs(project_uuid, filters, ip_page, ips.page_size));
	}

	renewCreds(ips=this.props.ips.data) {
	}

	renewFiles(ips=this.props.ips.data) {
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	componentDidUpdate(prevProps) {
		let { filters } = this.props;

		if (!_.isEqual(filters, prevProps.filters)) {
			this.renewIps(0, filters);
		}
	}

	render() {
		return (
			<div>
				<Loading
					componentLoading={!this.props.ips.loaded}
				>
					<IPsList
						renewIps={this.renewIps}
						{...this.props}
					/>
				</Loading>
			</div>
		)
	}
}

IPsListScopesUpdater.contextTypes = {
    store: PropTypes.object
}

export default IPsListScopesUpdater;