import _ from 'lodash';
import React from 'react';
import { Table, Button } from 'react-bootstrap';

import EachTask from './EachTask.jsx';

class Tasks extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const tasks = _.map(this.props.tasks, (x) => {
			return <EachTask key={x.task_id} task={x}/>
		});

		return (
			<div>
				<h3>Active tasks</h3>
				<Table>
					<thead>
						<tr>
							<td>Task ID</td>
							<td>Task Type</td>
							<td>Progress</td>
						</tr>
					</thead>
					<tbody>
						{tasks}
					</tbody>
				</Table>
			</div>
		)
	}

}

export default Tasks;
