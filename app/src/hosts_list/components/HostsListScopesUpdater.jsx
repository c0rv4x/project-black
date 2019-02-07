import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types';

import HostsList from './HostsList.jsx'
import Loading from '../../common/loading/Loading.jsx'

import { flushAndRequestHosts } from '../../redux/hosts/actions.js'


class HostsListScopesUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.renewHosts = this.renewHosts.bind(this);
		this.renewCreds = this.renewCreds.bind(this);
		this.renewFiles = this.renewFiles.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	renewHosts(page=this.props.hosts.page, page_size=this.props.hosts.page_size, filters=this.props.filters) {
		this.context.store.dispatch(flushAndRequestHosts(this.props.project_uuid, filters, page, page_size));
	}

	renewCreds(hosts=this.props.hosts.data) {
	}

	renewFiles(hosts=this.props.hosts.data) {
	}

	componentDidUpdate(prevProps) {
		var { hosts, filters } = this.props;

		if (!_.isEqual(filters, prevProps.filters)) {
			this.renewHosts(0, hosts.page_size, filters);
		}
	}

	render() {
		return (
			<div>
				<Loading
					componentLoading={!this.props.hosts.loaded}
				>
				<HostsList
					renewHosts={this.renewHosts}
					{...this.props} />
				</Loading>
			</div>
		)
	}
}

HostsListScopesUpdater.contextTypes = {
    store: PropTypes.object
}

export default HostsListScopesUpdater;