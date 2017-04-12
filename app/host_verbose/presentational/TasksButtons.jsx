import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'


class TasksButtons extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<DropdownButton bsStyle="default" title="Tasks" id="dropdown-tasks-host">
				<MenuItem eventKey="3">Renew screenshot</MenuItem>
				<MenuItem eventKey="4">Dirbuster</MenuItem>
			</DropdownButton>
		)
	}
}

export default TasksButtons;
