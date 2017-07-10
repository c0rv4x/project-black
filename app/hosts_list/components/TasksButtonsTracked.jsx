import React from 'react'

import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ButtonsTasks from './ButtonsTasks.jsx'


class TasksButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.dirbusterStart = this.dirbusterStart.bind(this);
	}

	dirbusterStart(options) {
		for (var each_host of this.props.scopes) {
			var ports = new Set();

			for (var ip_address of each_host.ip_addresses) {
				ip_address.scans.map((x) => {
					ports.add(x.port_number);
				});
			}

			for (var each_port of [...ports]) {
				var target = each_host.hostname;
				this.tasksEmitter.requestCreateTask('dirsearch', 
													[target + ":" + each_port], 
													{'program': options}, 
													this.props.project.project_uuid)
			}
		}
	}

	render() {
		return (
			<ButtonsTasks tasks={
				[
					{
						"name": "Dirbuter",
						"handler": this.dirbusterStart,
						"preformed_options": [
							{
								"name": "PHP fanboy",
								"options": {
									"extensions": "php,php5,phps,php.bak",
									"path": "/"
								}
							},
							{
								"name": "ASP faggot",
								"options": {
									"extensions": "asp",
									"path": "/"
								}
							},
							{
								"name": "Personal favourites",
								"options": {
									"extensions": "php,asp,txt,conf,log,bak",
									"path": "/"
								}
							}
						],
						"available_options": [
							{
								"name": "path",
								"type": "text",
								"default_value": "/"
							},						
							{
								"name": "extensions",
								"type": "text",
								"default_value": "txt,conf,log,bak"
							},
							{
								"name": "recursive",
								"type": "checkbox",
								"default_value": true
							}
						]
					}
				]
			} />
		)
	}
}

export default TasksButtonsTracked;