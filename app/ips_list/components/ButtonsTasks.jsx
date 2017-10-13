import _ from 'lodash'
import React from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import TasksOptions from './TasksOptions.jsx'


class ButtonsTasks extends React.Component {

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this._toggle = this._toggle.bind(this);
		this.state = {
			dropdownOpen: false,
			test: false
		};
	}

	toggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

	_toggle() {
		console.log(this.state.test);
		this.setState({
			test: !this.state.test
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
						<DropdownItem onClick={this._toggle}>Test</DropdownItem>
					</DropdownMenu>
				</ButtonDropdown>
			</div>
		)
	}

}

export default ButtonsTasks;
