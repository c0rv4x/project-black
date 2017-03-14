import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { Table } from 'react-bootstrap'

import ProjectStore from '../projects_list/ProjectStore.js';
import ScopeStore from './ScopeStore.js';
import ScopeTable from './ScopeTable.jsx';
import ScopeAdder from './ScopeAdder.jsx';
import ProjectComment from './ProjectComment.jsx';


class ProjectDetails extends Reflux.Component
{

	constructor(props) {
		super(props);

        this.stores = [ScopeStore, ProjectStore];
		this.project_name = props['match']['params']['project_name'];
		this.project_uuid = null;

		this.handleProjectCommentEdit = this.handleProjectCommentEdit.bind(this);
	}

	handleProjectCommentEdit(newValue) {
		var projects = this.state.projects;
		for (var i = 0; i < projects.length; i++) {
			if (projects[i].project_uuid == this.uuid) {
				projects.comment = newValue;
				this.setState({projects: projects});
			}
		}
	}

	render() {
		const filteredScope = _.filter(this.state.scopes, (x) => {
			return x.project_uuid == this.project_uuid;
		});

		const displayedScopes = _.map(filteredScope, (x) => {
			return <ScopeTable scope={x} key={x.scope_id}/>
		});

		const filteredProjects = _.filter(this.state.projects, (x) => {
			return x.project_name == this.project_name;
		});

		const projectComment = _.map(filteredProjects, (x) => {
			return <ProjectComment project={x} 
								   key={x.project_uuid} 
								   onCommentEdit={this.handleProjectCommentEdit}/>
		});

		var scopeAdder = "";
		if (filteredProjects.length) {
			this.project_uuid = filteredProjects[0].project_uuid;

			scopeAdder = <ScopeAdder project_uuid={filteredProjects[0].project_uuid}/>
		}		

		return (
			<div>
				<h2>Project Details {this.project_name}</h2>
                {this.state.loading && 
                    <div>Loading...</div>
                }
                {this.state.errorMessage && 
                    <div>{this.state.errorMessage}</div>
                }
				
				{projectComment}
				{scopeAdder}
				<br/>

				<h3>Currently in scope:</h3>
				<Table bordered>
					<thead>
						<tr>
							<td>Scope ID</td>
							<td>Hostname</td>
							<td>ip_address</td>
							<td>Project Name</td>
							<td>Control</td>
						</tr>
					</thead>
					<tbody>
						{displayedScopes}
					</tbody>
				</Table>
			</div>
		)
	}

}

export default ProjectDetails;
