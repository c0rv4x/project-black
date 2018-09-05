import _ from 'lodash'
import React from 'react'
import { Table } from 'semantic-ui-react'

import TasksGroup from './TasksGroup.jsx'

class Tasks extends React.Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(nextProps, this.props);
	}

	render() {
		let groupped_tasks = {};

		for (let each_task of this.props.tasks) {
			const { task_type, status, progress } = each_task;

			if (groupped_tasks.hasOwnProperty(task_type)) {
				groupped_tasks[task_type].push(each_task);
			}
			else {
				groupped_tasks[task_type] = [each_task];
			}
		}

		let tasks = [];
		_.forOwn(groupped_tasks, (value, key) => {
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
	}

}

export default Tasks;
