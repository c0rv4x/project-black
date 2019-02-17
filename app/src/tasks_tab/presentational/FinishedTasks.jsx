import React from 'react'

import TaskEntry from './TaskEntry.jsx'

import {
	Box,
	Heading,
	Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody
} from 'grommet'


class FinishedTasks extends React.Component {
	render() {
		const { tasks } = this.props;

		return (
			<Box>
				<Heading level="3">Completed tasks</Heading>
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>Type</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Targets</TableCell>
							<TableCell>Options</TableCell>
							<TableCell>Time To Complete</TableCell>
							<TableCell>Finished</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tasks.map((task) => {
							return <TaskEntry key={task.task_id} task={task} />
						})}
					</TableBody>
				</Table>
			</Box>
			
		)
	}
}

export default FinishedTasks;
