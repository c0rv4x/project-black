import _ from 'lodash'
import React from 'react'

import TableUpdater from './TableUpdater.jsx'


class TableFilters extends React.Component {

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
			<TableUpdater
				 filters={this.state.filters}
				 applyFilters={this.applyFilters}
				 {...this.props}
			/>
		)
	}

}


export default TableFilters;
