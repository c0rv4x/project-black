import _ from 'lodash'
import React from 'react'
import { Table, Button } from 'react-bootstrap'

import EachTask from './EachTask.jsx'

class Tasks extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const tasks = _.map(this.props.tasks, (x) => {
			return <EachTask key={x.task_id} task={x}/>
		});

		if (_.get(this.props.tasks, 'length', 0)) {
			return (
				<div>
					<h3>Active tasks</h3>
					<Table>
						<thead>
							<tr>
								<td>Task Type</td>
								<td>Status</td>
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
		else {
			return (
				<div></div>
			)
		}
	}

}

export default Tasks;
