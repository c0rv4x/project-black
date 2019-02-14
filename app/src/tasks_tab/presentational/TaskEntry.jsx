import React from 'react'

import { Box, TableCell, TableRow } from 'grommet'


class TaskEntry extends React.Component {
	render() {
		const { task } = this.props;

		console.log(task);
		return (
			<TableRow>
				<TableCell>{task.task_type}</TableCell>
				<TableCell>{task.status}</TableCell>
				<TableCell>{task.target}</TableCell>
				<TableCell>{task.date_added}</TableCell>
				<TableCell>{task.date_finished}</TableCell>
			</TableRow>
		)
	}
}

export default TaskEntry;
