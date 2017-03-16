import React from 'react';

import ProjectDetailsPage from '../presentational/ProjectDetailsPage.jsx';
import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": ""
		}
		this.emitter = new ScopesSocketioEventsEmitter();


		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
	}

	handleNewScopeChange(e) {
		this.setState({ newScopeInput: e.target.value });
	}

	submitNewScope(scopes) {
		this.emitter.createScope(this.props.project.project_uuid, scopes);
	}

	render() {
		return (
			<ProjectDetailsPage newScopeInput={this.state.newScopeInput}
							    handleNewScopeChange={this.handleNewScopeChange}
							    onNewScopeClick={
							    	(scopes) => 
							    		this.submitNewScope(scopes)
							    }

							    scopes={this.props.scopes}/>
		)
	}
}

export default ProjectDetails;