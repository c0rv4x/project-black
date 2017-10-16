import _ from 'lodash'
import React from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap';


import TasksOptions from './TasksOptions.jsx'
import Menu from './Menu.jsx'


class ButtonsTasks extends React.Component {

	constructor(props) {
		super(props);

		this.toggle_dropdown = this.toggle_dropdown.bind(this);
		this.state = {
			dropdownOpen: false
		};
	}

	toggle_dropdown() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	render() {
		return (
			<ButtonDropdown color="default" isOpen={this.state.dropdownOpen} toggle={this.toggle_dropdown} >
				<DropdownToggle caret>
					Start Task
				</DropdownToggle>
				<Menu tasks={this.props.tasks} />
			</ButtonDropdown>
		)
	}

}

export default ButtonsTasks;
