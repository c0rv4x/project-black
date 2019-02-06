import React from 'react'
import PropTypes from 'prop-types'

import IPsListScopesUpdater from './IPsListScopesUpdater.jsx'

import { setIPsFilters } from '../../redux/ips/actions'


class IPsListFilters extends React.Component {

	constructor(props) {
		super(props);

		this.applyFilters = this.applyFilters.bind(this);	
	}

	applyFilters(filters) {
		this.context.store.dispatch(setIPsFilters(filters));
	}

	render() {
		return (
			<IPsListScopesUpdater
				 ips={this.props.ips}
				 tasks={this.props.tasks}
				 project_uuid={this.props.project_uuid}
				 tasks={this.props.tasks}
				 dicts={this.props.dicts}
				 filters={this.props.ips.filters}
				 applyFilters={this.applyFilters} />
		)
	}

}

IPsListFilters.contextTypes = {
    store: PropTypes.object
}

export default IPsListFilters;
