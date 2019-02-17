import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import { renderParams } from '../../common/tasks_scoped/TasksScoped.jsx'

import { Box, TableCell, TableRow, Text } from 'grommet'


class FinishedTaskEntry extends React.Component {
	render() {
		const { task } = this.props;
		const timeToComplete = new Date(new Date(task.date_finished) - new Date(task.date_added));

		let color = null
		if (task.status == 'Aborted') color = 'status-critical';
		else if (task.status == 'Finished') color = 'status-ok';

		return (
			<TableRow>
				<TableCell>{task.task_type}</TableCell>
				<TableCell><Text color={color}>{task.status}</Text></TableCell>
				<TableCell>{task.target}</TableCell>
				<TableCell>{renderParams(task.params)}</TableCell>
				<TableCell>{timeToComplete / 1000 }s</TableCell>
				<TableCell><ReactTimeAgo date={new Date(task.date_finished)} /></TableCell>
			</TableRow>
		)
	}
}

export default FinishedTaskEntry;
