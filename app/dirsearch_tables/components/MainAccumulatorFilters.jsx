import React from 'react'

import MainAccumulatorUpdater from './MainAccumulatorUpdater.jsx'

class MainAccumulatorFilters extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			filters: {
				files: ['%']
			}
		};

		this.applyFilters = this.applyFilters.bind(this);	
	}

	applyFilters(filters) {
		console.log("Applying filter", filters);
		this.setState({
			filters: filters
		})
	}
    
	render() {
		return (
			<MainAccumulatorUpdater
				 filters={this.state.filters}
				 applyFilters={this.applyFilters}
				 {...this.props}
			/>
		)
	}
}

export default MainAccumulatorFilters;