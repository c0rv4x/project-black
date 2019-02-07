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

	renewIps(ip_page=this.props.ips.page, ip_page_size=this.props.ips.page_size, filters=this.props.filters) {
		let { project_uuid } = this.props;

		this.context.store.dispatch(flushAndRequestIPs(project_uuid, filters, ip_page, ip_page_size));
	}

	renewCreds(ips=this.props.ips.data) {
	}

	renewFiles(ips=this.props.ips.data) {
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	componentDidUpdate(prevProps) {
		let { filters, ips } = this.props;

		if (!_.isEqual(filters, prevProps.filters)) {
			this.renewIps(0, ips.pages_size, filters);
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