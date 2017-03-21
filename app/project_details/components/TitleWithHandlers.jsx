import React from 'react'
import { Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

import TasksSocketioEventsEmitter from '../../common/tasks/TasksSocketioEventsEmitter.js';
import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';
import TitleButtonsTasks from '../presentational/TitleButtonsTasks.jsx';


class TitleWithHandlers extends React.Component {

	constructor(props) {
		super(props);

		this.scopesEmitter = new ScopesSocketioEventsEmitter();
		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.runMasscan = this.runMasscan.bind(this);
		this.resolveScopes = this.resolveScopes.bind(this);
	}

	runMasscan() {
		var targets = _.map(this.props.scopes, (x) => {
			return x.ip_address || x.hostname
		});

		this.tasksEmitter.requestCreateTask('masscan', targets, "", this.props.project.project_uuid)
	}	

	resolveScopes(scopes_ids, project_uuid) {
		this.scopesEmitter.requestResolveScopes(scopes_ids, project_uuid);
	}

	render() {
		return (
			<TitleButtonsTasks project={this.props.project}
							   runMasscan={this.runMasscan}
							   resolveScopes={this.resolveScopes}/>
		)
	}

}


export default TitleWithHandlers;