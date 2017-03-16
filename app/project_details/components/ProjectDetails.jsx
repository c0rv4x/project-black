import React from 'react';

import ProjectDetailsPage from '../presentational/ProjectDetailsPage.jsx';


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": ""
		}

		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
	}

	handleNewScopeChange(e) {
		this.setState({ newScopeInput: e.target.value });
	}

	submitNewScope() {
	}

	render() {
		return (
			<ProjectDetailsPage newScopeInput={this.state.newScopeInput}
							    handleNewScopeChange={this.handleNewScopeChange}
							    onNewScopeClick={this.submitNewScope}/>
		)
	}
}

export default ProjectDetails;