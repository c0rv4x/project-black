import _ from 'lodash'
import React from 'react'
import { Table } from 'semantic-ui-react'

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
				<div>
					<h3>Active tasks</h3>
					<Table compact>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Type</Table.HeaderCell>
								<Table.HeaderCell>Queued Tasks</Table.HeaderCell>
								<Table.HeaderCell>Progress</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{tasks}
						</Table.Body>
					</Table>
				</div>
			)			
		}
		else {
			return <div>There are no active tasks</div>;
		}
	}

}

export default Tasks;
