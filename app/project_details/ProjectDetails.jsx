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
	}

	render() {
		const filteredScope = _.filter(this.state.scopes, (x) => {
			return x["project_uuid"] == this.project_uuid;
		});

		var displayedScopes = _.map(filteredScope, (x) => {
			return <ScopeTable scope={x} key={x.scope_id}/>
		});

		const filteredProject = _.filter(this.state.projects, (x) => {
			return x["project_name"] == this.project_name;
		})[0];

		var projectComment = "";
		var scopeAdder = "";

		if (filteredProject) {
			this.project_uuid = filteredProject.project_uuid;

			projectComment = <ProjectComment project_name={filteredProject.project_name}
											 project_uuid={filteredProject.project_uuid}
											 comment={filteredProject.comment}/>
			scopeAdder = <ScopeAdder project_uuid={filteredProject.project_uuid}/>
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
