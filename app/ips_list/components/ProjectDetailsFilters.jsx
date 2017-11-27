import React from 'react'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'

import ProjectDetailsScopesUpdater from './ProjectDetailsScopesUpdater.jsx'


class ProjectDetailsFilters extends React.Component {

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
			<ProjectDetailsScopesUpdater
				 scopes={this.props.scopes}
				 project={this.props.project}
				 filters={this.state.filters}
				 applyFilters={this.applyFilters} />
		)
	}

}


export default ProjectDetailsFilters;
