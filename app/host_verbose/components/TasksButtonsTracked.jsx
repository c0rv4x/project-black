import React from 'react'

import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ButtonsTasks from '../../common/ButtonsTasks.jsx'


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
											[scheme + "://" + target], 
											{'program': options}, 
											this.props.project.project_uuid)
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
								"name": "PHP",
								"options": [
									{
										"name": "Extensions",
										"value": "php,txt,conf,log,bak"
									}
								]
							},
							{
								"name": "ASP",
								"options": [
									{
										"name": "Extensions",
										"value": "asp,txt,conf,log,bak"
									}
								]
							}							
						]
					}
				]
			} />
		)
	}
}

export default TasksButtonsTracked;