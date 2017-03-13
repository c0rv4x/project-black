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
		console.log(props);
        this.stores = [ScopeStore, ProjectStore];
		this.project_name = props['match']['params']['project_name'];
	}

	render() {
		var onlyMineScope = _.filter(this.state.scopes, (x) => {
			return x["project_name"] == this.project_name;
		});

		var displayedScopes = _.map(onlyMineScope, (x) => {
			return <ScopeTable 
					key={x.scope_id}
					scope_id={x.scope_id}
					hostname={x.hostname}
					ip_address={x.ip_address}
					project_name={x.project_name}/>
		});

		const projectComment = _.map(this.state.projects, (x) => {
			if (x["project_name"] == this.project_name) {
				return <ProjectComment project_uuid={x.project_uuid} project_name={x.project_name} comment={x.comment}/>
			}
		})[0];

		const scopeAdder = _.map(this.state.projects, (x) => {
			if (x["project_name"] == this.project_name) {
				return <ScopeAdder project_name={x.project_name}/>
			}
		})[0];

		return (
			<div>
				<h2>Project Details {this.project_name}</h2>
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
