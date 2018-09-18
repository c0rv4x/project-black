import React from 'react'


class TasksTab extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}	

	render() {
		return (
			<div>

			</div>
		)
	}
}

export default TasksTab;
