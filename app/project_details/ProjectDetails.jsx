import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { Table } from 'react-bootstrap'

import ScopeStore from './ScopeStore.js';
import ScopeTable from './ScopeTable.jsx';
import ScopeAdder from './ScopeAdder.jsx';


class ProjectDetails extends Reflux.Component
{

	constructor(props) {
		super(props);
        this.store = ScopeStore;

		this.project_name = props['match']['params']['project_name'];
	}

	render() {
		var scopes = this.state.scopes;

		var onlyMineScope = _.filter(scopes, (x) => {
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

		return (
			<div>
				<h2>Project Details {this.project_name}</h2>
				<ScopeAdder project_name={this.project_name}/>
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
