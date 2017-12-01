import React from 'react'

import HostsListScopesUpdater from './HostsListScopesUpdater.jsx'


class HostsListFilters extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: {}
		};

		this.applyFilters = this.applyFilters.bind(this);	
	}

	applyFilters(filters) {
		this.setState({
			filters: filters
		})
	}

	render() {
		return (
			<HostsListScopesUpdater
				 hosts={this.props.hosts}
				 project_uuid={this.props.project_uuid}
				 filters={this.state.filters}
				 applyFilters={this.applyFilters}
				 tasks={this.props.tasks} />
		)
	}

}


export default HostsListFilters;
