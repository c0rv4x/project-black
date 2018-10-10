import React from 'react'

import IPsListScopesUpdater from './IPsListScopesUpdater.jsx'


class IPsListFilters extends React.Component {

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
			<IPsListScopesUpdater
				 ips={this.props.ips}
				 tasks={this.props.tasks}
				 project_uuid={this.props.project_uuid}
				 tasks={this.props.tasks}
				 dicts={this.props.dicts}
				 filters={this.state.filters}
				 applyFilters={this.applyFilters} />
		)
	}

}


export default IPsListFilters;
