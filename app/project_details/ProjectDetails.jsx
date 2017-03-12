import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';

import ScopeStore from './ScopeStore.js';
import ScopeTable from './ScopeTable.jsx';


class ProjectDetails extends Reflux.Component
{

	constructor(props) {
		super(props);
        this.store = ScopeStore;

		this.projectName = props['match']['params']['projectName'];
	}

	render() {
		var scopes = this.state.scopes;

		var onlyMineScope = _.filter(scopes, (x) => {
			return x["projectName"] == this.projectName;
		});

		var displayedScopes = _.map(onlyMineScope, (x) => {
			return <ScopeTable 
					key={x.scopeID}
					scopeID={x.scopeID}
					hostname={x.hostname}
					IP={x.IP}
					projectName={x.projectName}/>
		});

		return (
			<div>
				<h2>Project Details {this.projectName}</h2>
				<table>
					<thead>
						<tr>
							<td>Scope ID</td>
							<td>Hostname</td>
							<td>IP</td>
							<td>Project Name</td>
						</tr>
					</thead>
					<tbody>
						{displayedScopes}
					</tbody>
				</table>
			</div>
		)
	}

}

export default ProjectDetails;