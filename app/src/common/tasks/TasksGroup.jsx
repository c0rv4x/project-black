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
				const progressValue = each_task.progress;
				progresses.push(
					<Box
						id={"progress_task_" + each_task.task_id}
						key={"progress_task_" + each_task.task_id}
						alignSelf="stretch"
					>
						{
							(progressValue == 1337) ? (
								<Stack anchor="center">
									<Meter
										type="bar"
										values={[{ value: progressValue }]}
										size="full"
										thickness="medium"
									/>
									<Box direction="row" align="center" pad={{ bottom: "xsmall" }}>
										<Text size="small" weight="bold">
											{each_task.progress}
										</Text>
										<Text size="small">%</Text>
									</Box>
								</Stack>
							) : (
								<Stack anchor="center">
									<Meter
										type="bar"
										values={[{ value: 100 }]}
										size="full"
										thickness="medium"
									/>
									<Box direction="row" align="center" pad={{ bottom: "xsmall" }}>
										<Text size="small" weight="bold">
											N/A
										</Text>
									</Box>
								</Stack>
							)
						}
					</Box>
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
