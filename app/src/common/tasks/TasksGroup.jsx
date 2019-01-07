import React from 'react'

import {
	Box,
    TableRow,
	TableCell,
	Meter,
	Stack,
	Text
} from 'grommet'


class EachTask extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		let { tasks, type } = this.props;
		let progresses = [];

		let tasks_sorted = tasks.sort((a, b) => {
			if (a.task_id > b.task_id) return 1;
			if (a.task_id < b.task_id) return -1;
			return 0;
		});

		for (let each_task of tasks_sorted) {
			if (each_task.status == 'Working') {
				progresses.push(
					<Stack
						id={"progress_task_" + each_task.task_id}
						key={"progress_task_" + each_task.task_id}
						anchor="center">
						<Meter
							type="bar"
							background="light-2"
							values={[{ value: each_task.progress }]}
							size="medium"
							thickness="medium"
						/>
						<Box direction="row" align="center">
							<Text size="small" weight="bold">
								{each_task.progress}
							</Text>
							<Text size="small">%</Text>
						</Box>
					</Stack>
				);
			}
		}

		return (
			<TableRow key={type}>
				<TableCell>{type}</TableCell>
				<TableCell>{tasks.length}</TableCell>
				<TableCell>{progresses}</TableCell>
			</TableRow>
		)
	}
}

export default EachTask;
