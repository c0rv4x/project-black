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
		var scheme = this.props.activePortNumber === 443 ? 'https' : 'http';
		var target = this.props.host.hostname;
		this.tasksEmitter.requestCreateTask('dirsearch', 
											[scheme + "://" + target + ':' + this.props.activePortNumber], 
											{'program': options}, 
											this.props.project.project_uuid)
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
								"name": "PHP",
								"options": {
									"extensions": "php,php5,phps,php.bak",
									"path": "/"
								}
							},
							{
								"name": "ASP",
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