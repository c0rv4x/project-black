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
				 project={this.props.project}
				 tasks={this.props.tasks}
				 filters={this.state.filters}
				 applyFilters={this.applyFilters} />
		)
	}

}


export default IPsListFilters;
