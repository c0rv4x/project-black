import React from 'react';


class EachTask extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<tr>
				<td>this.props.task.task_id</td>
				<td>this.props.task.task_type</td>
				<td>this.props.task.task_progress</td>
			</tr>
		)
	}
}

export default EachTask;