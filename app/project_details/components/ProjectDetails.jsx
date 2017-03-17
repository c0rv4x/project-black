import React from 'react';

import ProjectDetailsPage from '../presentational/ProjectDetailsPage.jsx';
import ProjectsSocketioEventsEmitter from '../../common/projects/ProjectsSocketioEventsEmitter.js';
import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": "",
			"commentInput": ""
		}
		this.projectsEmitter = new ProjectsSocketioEventsEmitter();
		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
		this.deleteScope = this.deleteScope.bind(this);

		this.onCommentInputChange = this.onCommentInputChange.bind(this);
		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	handleNewScopeChange(e) {
		this.setState({ newScopeInput: e.target.value });
	}

	submitNewScope(scopes) {
		this.scopesEmitter.createScope(this.props.project.project_uuid, scopes);
	}

	deleteScope(scope_id) {
		this.scopesEmitter.deleteScope(scope_id);
	}

	onCommentInputChange(e) {
		this.setState({ commentInput: e.target.value });
	}

	commentSubmitted() {
		this.projectsEmitter.updateProject(
			this.props.project.project_uuid,
			null,
			this.state.commentInput);
	}

	componentWillReceiveProps(newProps) {
		if ((newProps.project) && (newProps.project.comment != null)) {
			this.setState({
				"commentInput": newProps.project.comment
			});
		}		
	}

	render() {
		return (
			<ProjectDetailsPage newScopeInput={this.state.newScopeInput}
							    handleNewScopeChange={this.handleNewScopeChange}
							    onNewScopeClick={
							    	(scopes) => 
							    		this.submitNewScope(scopes)
							    }

							    deleteScope={this.deleteScope}
							    scopes={this.props.scopes}

								commentInput={this.state.commentInput}
								onCommentInputChange={this.onCommentInputChange}
								commentSubmitted={this.commentSubmitted} 

								project={this.props.project}/>
		)
	}
}

export default ProjectDetails;