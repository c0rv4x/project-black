import React from 'react'

import TasksTabHead from '../presentational/TasksTabHead.jsx'


class TasksTab extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TasksTabHead />
		)
	}
}

export default TasksTab;