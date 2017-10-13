import _ from 'lodash'
import React from 'react'
import { Table } from 'reactstrap'

import EachTask from './EachTask.jsx'

class Tasks extends React.Component {

	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(nextProps, this.props);
	}

	render() {
		var known_task_types = ['dnsscan', 'nmap', 'dirsearch', 'masscan'];
		var tasks_object = {};

		for (var task_type of known_task_types) {
			tasks_object[task_type] = {
				"status": "None",
				// "progress": 0,
				"progress_sum": 0,
				"amount": 0
			};
		}

		for (var each_task of this.props.tasks) {
			const task_type = each_task["task_type"];
			const status = each_task["status"];
			const progress = each_task["progress"];

			if (tasks_object[task_type]['status'] == "None") {
				tasks_object[task_type]['status'] = status;
			}
			else if (status != "Working") {
				tasks_object[task_type]['status'] = status;
			}

			tasks_object[task_type]['progress_sum'] += progress;
			tasks_object[task_type]['amount'] += 1;
		}

		var tasks = [];
		_.forOwn(tasks_object, (value, key) => {
			tasks.push(<EachTask key={key} task={value} type={key} />);
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
