import _ from 'lodash'
import React from 'react'

import { Table } from 'react-bootstrap'
import TaskListEntry from './TaskListEntry.jsx'


class TasksList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const table_body = _.map(this.props.tasks, (x) => {
			return <TaskListEntry key={x.task_id} task={x} />
		});

		return (
			<Table>
				<thead>
					<tr>
						<td>Task Type</td>
						<td>Targets</td>
						<td>Params</td>
						<td>Status</td>
					</tr>
				</thead>
				<tbody>
					{table_body}
				</tbody>
			</Table>
		)
	}
}

export default TasksList;
