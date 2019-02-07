import React from 'react'
import PropTypes from 'prop-types'

import HostsListScopesUpdater from './HostsListScopesUpdater.jsx'

import { setHostsFilters } from '../../redux/hosts/actions.js'


class HostsListFilters extends React.Component {

	constructor(props) {
		super(props);

		this.applyFilters = this.applyFilters.bind(this);	
	}

	applyFilters(filters) {
		this.context.store.dispatch(setHostsFilters(filters));
	}

	render() {
		return (
			<HostsListScopesUpdater
				 hosts={this.props.hosts}
				 dicts={this.props.dicts}
				 project_uuid={this.props.project_uuid}
				 filters={this.props.hosts.filters}
				 applyFilters={this.applyFilters}
				 tasks={this.props.tasks} />
		)
	}

}

HostsListFilters.contextTypes = {
    store: PropTypes.object
}

export default HostsListFilters;
