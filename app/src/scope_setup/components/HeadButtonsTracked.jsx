import React from 'react'

import { Button, Divider } from 'semantic-ui-react'

import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import HeadButtons from '../presentational/HeadButtons.jsx'


class HeadButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.resolveScopes = this.resolveScopes.bind(this);
	}

	resolveScopes(scopes_ids, project_uuid) {
		this.hostsEmitter.requestResolveHosts(scopes_ids, project_uuid);
	}

	render() {
		return (
			<div>
				<HeadButtons project={this.props.project}
							 hostsResolved={this.props.hosts.resolve_finished}
							 resolveScopes={() => this.resolveScopes(null, this.props.project.project_uuid)}/>

				<Divider hidden />
			</div>
		)
	}
}

export default HeadButtonsTracked;
