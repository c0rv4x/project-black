import _ from 'lodash'
import React from 'react'

import { Table } from 'react-bootstrap'


class TasksListEntry extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const targets = _.map(this.props.task.target, (x) => {
			return <div key={x}>{x}</div>
		});

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