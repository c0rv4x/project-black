import React from 'react'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import HeadButtons from '../presentational/HeadButtons.jsx'
import ButtonTasks from '../../common/tasks_buttons/components/ButtonTasks.jsx'


class HeadButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.scopesEmitter = new ScopesSocketioEventsEmitter();
		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.resolveScopes = this.resolveScopes.bind(this);
		this.dnsscanStart = this.dnsscanStart.bind(this);
	}

	resolveScopes(scopes_ids, project_uuid) {
		this.scopesEmitter.requestResolveScopes(scopes_ids, project_uuid);
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
				<hr />
			</div>
		)
	}
}

export default HeadButtonsTracked;
