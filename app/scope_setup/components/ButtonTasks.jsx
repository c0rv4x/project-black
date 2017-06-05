import _ from 'lodash'
import React from 'react'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'

import TasksOptions from './TasksOptions.jsx'


class ButtonsTasks extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var i = 0;
		const menu_items = _.map(this.props.tasks, (x) => {
			i++;
			return <TasksOptions key={i} number={i} task={x} />
		});

		return (
			<DropdownButton bsStyle="default" title="Start Task" id="dropdown-basic">
				{menu_items}
			</DropdownButton>
		)
	}

}

export default ButtonsTasks;
