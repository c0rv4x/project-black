import _ from 'lodash';
import React from 'react';

import ProjectDetailsPage from '../presentational/ProjectDetailsPage.jsx';
import ProjectsSocketioEventsEmitter from '../../common/projects/ProjectsSocketioEventsEmitter.js';
import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';
import TasksSocketioEventsEmitter from '../../common/tasks/TasksSocketioEventsEmitter.js';


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": "",
			"commentInput": ""
		}
		this.projectsEmitter = new ProjectsSocketioEventsEmitter();
		this.scopesEmitter = new ScopesSocketioEventsEmitter();
		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
		this.deleteScope = this.deleteScope.bind(this);
		this.resolveScopes = this.resolveScopes.bind(this);

		this.onCommentInputChange = this.onCommentInputChange.bind(this);
		this.commentSubmitted = this.commentSubmitted.bind(this);

		this.runMasscan = this.runMasscan.bind(this);
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

	resolveScopes(scopes_ids, project_uuid) {
		this.scopesEmitter.resolveScopes(scopes_ids, project_uuid);
	}

	onCommentInputChange(e) {
		this.props.onCommentChange(e.target.value, this.props.project.project_uuid);
	}

	commentSubmitted() {
		this.projectsEmitter.updateProject(
			this.props.project.project_uuid,
			null,
			this.props.project.comment);
	}

	runMasscan() {
		var targets = _.map(this.props.scopes, (x) => {
			return x.ip_address || x.hostname
		});

		this.tasksEmitter.createTask('masscan', targets, "", this.props.project.project_uuid)
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

								// commentInput={this.state.commentInput}
								commentInput={this.props.project.comment}
								onCommentInputChange={this.onCommentInputChange}
								commentSubmitted={this.commentSubmitted} 

								project={this.props.project}

								runMasscan={this.runMasscan}

								tasks={this.props.tasks}

								resolveScopes={this.resolveScopes}

								scans={this.props.scans}/>
		)
	}
}

export default ProjectDetails;