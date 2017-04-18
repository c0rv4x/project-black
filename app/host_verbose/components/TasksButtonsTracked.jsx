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
		var target = this.props;
		this.tasksEmitter.requestCreateTask('dirsearch', 
											targets, 
											{'program': ['-p80,443']}, 
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