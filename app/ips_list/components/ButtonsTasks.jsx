import _ from 'lodash'
import React from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'

import TasksOptions from './TasksOptions.jsx'


class ButtonsTasks extends React.Component {

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			dropdownOpen: false
		};
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	render() {
		var i = 0;
		const menu_items = _.map(this.props.tasks, (x) => {
			i++;
			return <TasksOptions key={i} number={i} task={x} />
		});

		return (
			<div>
				<ButtonDropdown color="default" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
			        <DropdownToggle caret>
						Start Task
			        </DropdownToggle>
			        <DropdownMenu>
						{menu_items}
					</DropdownMenu>
				</ButtonDropdown>
			</div>
		)
	}

}

export default ButtonsTasks;
