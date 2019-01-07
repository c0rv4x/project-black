import _ from 'lodash'
import React from 'react'
import {
	Box,
	Heading,
	Table,
    TableHeader,
    TableRow,
    TableCell,
    TableBody
} from 'grommet'

import TasksGroup from './TasksGroup.jsx'

class Tasks extends React.Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	render() {
		let groupped_tasks = {};

		for (let each_task of this.props.tasks) {
			const { task_type } = each_task;

			if (groupped_tasks.hasOwnProperty(task_type)) {
				groupped_tasks[task_type].push(each_task);
			}
			else {
				groupped_tasks[task_type] = [each_task];
			}
		}

		let groupped_tasks_unsorted = [];
		_.forOwn(groupped_tasks, (value, key) => {
			groupped_tasks_unsorted.push([key, value]);
		});

		let groupped_tasks_sorted = groupped_tasks_unsorted.sort((a, b) => {
			if (a[0] < b[0]) return -1;
			if (a[0] > b[0]) return 1;
			return 0;
		});

		let tasks = [];
		groupped_tasks_sorted.map((a) => {
			let key = a[0];
			let value = a[1];
			tasks.push(<TasksGroup key={key} tasks={value} type={key} />);
		});

		if (_.get(this.props.tasks, 'length', 0)) {
			return (
				<Box>
					<Heading level="3">Active tasks</Heading>
					<Table>
						<TableHeader>
							<TableRow>
								<TableCell>Type</TableCell>
								<TableCell>Queued Tasks</TableCell>
								<TableCell>Progress</TableCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tasks}
						</TableBody>
					</Table>
				</Box>
			)			
		}
		else {
			return <div>There are no active tasks</div>;
		}
	}

}

export default Tasks;
