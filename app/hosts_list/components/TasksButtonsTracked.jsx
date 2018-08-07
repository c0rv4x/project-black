import _ from 'lodash'
import React from 'react'

import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ButtonTasks from '../../common/tasks_buttons/components/ButtonTasks.jsx'


class TasksButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.dirbusterStart = this.dirbusterStart.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}	

	dirbusterStart(options) {
		this.tasksEmitter.requestCreateTask('dirsearch',
											this.props.filters,
											{'program': options,
											 'targets': 'hosts'},
											this.props.project_uuid);
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