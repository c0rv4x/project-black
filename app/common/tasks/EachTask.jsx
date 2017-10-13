import React from 'react'
import { Badge } from 'reactstrap'


class EachTask extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		var progress = "N/A";
		if (this.props.task.status !== "None") {
			progress = this.props.task.progress_sum / this.props.task.amount || 0;
		}

		var label = <Badge>0</Badge>;

		if (this.props.task.amount > 0) {
			label = <Badge>{this.props.task.amount}</Badge>;
		}

		return (
			<tr>
				<td>{this.props.type} {label}</td>
				<td>{this.props.task.status}</td>
				<td>{progress}</td>
			</tr>
		)
	}
}

export default EachTask;
