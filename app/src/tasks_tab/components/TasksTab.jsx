import React from 'react'

import FinishedTasks from '../presentational/FinishedTasks.jsx'


class TasksTab extends React.Component {
	render() {
		const { tasks } = this.props;

		return (
			<div>
				<FinishedTasks tasks={tasks.finished} />
			</div>
		)
	}
}

export default TasksTab;
