import React from 'react'

import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ButtonTasks from '../../common/tasks_buttons/components/ButtonTasks.jsx'


class TasksButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.dirbusterStart = this.dirbusterStart.bind(this);
	}

	dirbusterStart(options) {
		// This is a set of pairs: ip + port, which should be scanned.
		var all_ips = new Set();

		for (var each_host of this.props.hosts) {
			var ports = new Set();

			for (var ip_address of each_host.ip_addresses) {
				ip_address.scans.map((x) => {
					ports.add(x.port_number);
				});
			}

			for (var each_port of [...ports]) {
				let target = each_host.hostname;
				this.tasksEmitter.requestCreateTask('dirsearch', 
													[target + ":" + each_port], 
													{'program': options}, 
													this.props.project_uuid);

				if (options.dirsearch_all_ips) {
					for (var ip_address of each_host.ip_addresses) {
						all_ips.add(ip_address.ip_address + ":" + each_port);
					}
				}
				else if (options.dirsearch_single_ip) {
					for (var ip_address of each_host.ip_addresses) {
						all_ips.add(ip_address.ip_address + ":" + each_port)
						break;
					}
				}
			}
		}

		for (var each_target of [...all_ips]) {
			this.tasksEmitter.requestCreateTask('dirsearch', 
												[each_target], 
												{'program': options}, 
												this.props.project_uuid);			
		}
	}

	render() {
		return (
			<ButtonTasks tasks={
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
									"extensions": "asp,aspx",
									"path": "/"
								}
							},
							{
								"name": "Personal favourites",
								"options": {
									"extensions": "php,asp,txt,conf,log,bak,sql",
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
								"name": "cookie",
								"type": "text",
								"default_value": ""
							},
							{
								"name": "recursive",
								"type": "checkbox",
								"default_value": false
							},
							{
								"name": "dirsearch_all_ips",
								"type": "checkbox",
								"text": "Add all current ips to dirsearch queue",
								"default_value": false
							},
							{
								"name": "dirsearch_single_ip",
								"type": "checkbox",
								"text": "Add one ip from each host to dirsearch queue",
								"default_value": false
							}					
						]
					}
				]
			} />
		)
	}
}

export default TasksButtonsTracked;