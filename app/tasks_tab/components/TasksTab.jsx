import React from 'react'

import TasksTabHead from '../presentational/TasksTabHead.jsx'
import TasksList from '../presentational/TasksList.jsx'


class TasksTab extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
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
