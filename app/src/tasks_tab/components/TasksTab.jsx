import React from 'react'

import ActiveTasks from './ActiveTasks.jsx'
import FinishedTasks from '../presentational/FinishedTasks.jsx'


class TasksTab extends React.Component {
	render() {
		const { tasks } = this.props;

		return (
			<div>
				<ActiveTasks tasks={tasks.active} />
				<FinishedTasks tasks={tasks.finished} />
			</div>
		)
	}
}

export default TasksTab;
