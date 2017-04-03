import _ from 'lodash'
import React from 'react'
import { Table } from 'react-bootstrap'

import TaskDetails from './TaskDetails.jsx'

class TasksListEntry extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			"showModal": false
		}

		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
	}
    
	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	render() {
		var targets = null;
		var extracted_target = this.props.task.target;

		targets = [];
		for (var target_number in extracted_target) {
			if (target_number > 1) {
				targets.push(<div key="some_key">...</div>);
				break;
			}
			else {
				const target = extracted_target[target_number];
				targets.push(<div key={target}>{target}</div>);				
			}
		}

		return (
			<tr onClick={this.open}>
				<td>{this.props.task.task_type}</td>
				<td>{targets}</td>
				<td>{this.props.task.params["program"].join()}</td>
				<td>{this.props.task.status}</td>
				<TaskDetails showModal={this.state.showModal}
							 close={this.close}
							 task={this.props.task} />
			</tr>
		)
	}
}

export default TasksListEntry;