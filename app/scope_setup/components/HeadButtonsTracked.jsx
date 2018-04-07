import React from 'react'

import { Divider } from 'semantic-ui-react'

import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import HeadButtons from '../presentational/HeadButtons.jsx'
import ButtonTasks from '../../common/tasks_buttons/components/ButtonTasks.jsx'


class HeadButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.resolveScopes = this.resolveScopes.bind(this);
		this.dnsscanStart = this.dnsscanStart.bind(this);
	}

	resolveScopes(scopes_ids, project_uuid) {
		this.hostsEmitter.requestResolveHosts(scopes_ids, project_uuid);
	}

	dnsscanStart(options) {
		console.log(this.props);

		for (var host of this.props.hosts) {
			this.tasksEmitter.requestCreateTask('dnsscan', 
												[host.hostname],
												{'program': options}, 
												this.props.project.project_uuid)				
		}
	}

	render() {
		return (
			<div>
				<HeadButtons project={this.props.project}
							 hostsResolved={this.props.hosts.resolve_finished}
							 resolveScopes={() => this.resolveScopes(null, this.props.project.project_uuid)}/>
				<ButtonTasks tasks={
					[
						{
							"name": "DNSscan",
							"handler": this.dnsscanStart,
							"preformed_options": [
								{
									"name": "Default",
									"options": {
										"dict": "some"
									}
								}
							],
							"available_options": [
								{
									"name": "dict",
									"type": "text",
									"default_value": "./dicc.txt"
								}
							]
						}
					]
				} />

				<br />
				<Divider />
			</div>
		)
	}
}

export default HeadButtonsTracked;
