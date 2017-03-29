import _ from 'lodash'
import React from 'react'

import { Table } from 'react-bootstrap'


class TasksListEntry extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var targets = [];
		for (var target_number in this.props.task.target) {
			if (target_number > 1) {
				targets.push(<div key="some_key">...</div>);
				break;
			}
			else {
				const target = this.props.task.target[target_number];
				targets.push(<div key={target}>{target}</div>);				
			}
		}

		const params = _.map(this.props.task.params, (x) => {
			return <div key={x}>{x}</div>
		});

		return (
			<tr>
				<td>{this.props.task.task_type}</td>
				<td>{targets}</td>
				<td>{params}</td>
				<td>{this.props.task.status}</td>
			</tr>
		)
	}
}

export default TasksListEntry;