import React from 'react'

import ActiveTaskEntry from '../presentational/ActiveTaskEntry.jsx'

import {
	Box,
	Heading,
	Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody
} from 'grommet'

class ActiveTasks extends React.Component {
    constructor(props) {
        super(props);

        this.cancelTask = this.cancelTask.bind(this);
    }

    cancelTask(task_id) {
        console.log(task_id);
    }

	render() {
		const { tasks } = this.props;

		return (
			<Box>
				<Heading level='3'>Active Tasks</Heading>
				<Table alignSelf='stretch'>
					<TableHeader>
						<TableRow>
							<TableCell>Type</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Targets</TableCell>
							<TableCell>Options</TableCell>
							<TableCell>Command</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tasks.map((task) => {
							return (
                                <ActiveTaskEntry
                                    key={task.task_id}
                                    task={task}
                                    cancelTask={() => this.cancelTask(task.task_id)}
                                />
                            )
						})}
					</TableBody>
				</Table>
			</Box>
		)
	}
}

export default ActiveTasks;
