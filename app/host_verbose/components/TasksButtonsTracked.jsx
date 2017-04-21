import React from 'react'

import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ButtonsTasks from '../../common/ButtonsTasks.jsx'


class TasksButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.dirbusterStart = this.dirbusterStart.bind(this);
	}

	dirbusterStart() {
		var scheme = this.props.activePortNumber === 443 ? 'https' : 'http';
		var target = this.props.host.hostname;
		this.tasksEmitter.requestCreateTask('dirsearch', 
											[scheme + "://" + target], 
											{'program': [{}]}, 
											this.props.project.project_uuid)
	}

	render() {
		return (
			<ButtonsTasks tasks={
				[
					{
						"name": "Dirbuter",
						"handler": this.dirbusterStart
					}
				]
			} />
		)
	}
}

export default TasksButtonsTracked;