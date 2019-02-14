import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import { Box, TableCell, TableRow } from 'grommet'


class TaskEntry extends React.Component {
	render() {
		const { task } = this.props;

		const timeToComplete = new Date(new Date(task.date_finished) - new Date(task.date_added));
		return (
			<TableRow>
				<TableCell>{task.task_type}</TableCell>
				<TableCell>{task.status}</TableCell>
				<TableCell>{task.target}</TableCell>
				<TableCell>{timeToComplete / 1000 }s</TableCell>
				<TableCell><ReactTimeAgo date={new Date(task.date_finished)} /></TableCell>
			</TableRow>
		)
	}
}

export default TaskEntry;
