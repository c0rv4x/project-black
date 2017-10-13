import _ from 'lodash'
import React from 'react'
import { DropdownMenu, DropdownItem, Modal } from 'reactstrap';

import TasksOptions from './TasksOptions.jsx'
import InnerModal from './InnerModal.jsx'


class Menu extends React.Component {

	constructor(props){
		super(props);

		this.toggle_modal = this.toggle_modal.bind(this);
		this.state = {
			current_task: {
				name: "",
				preformedOptions: [],
				availableOptions: [],
				handler: (() => {})
			},
			modalOpen: false
		};
	}

	toggle_modal() {
		this.setState({modalOpen: !this.state.modalOpen});
	}

	change_current_task(number) {
		this.setState({
			current_task: this.props.tasks[number],
			modalOpen: true
		});
	}

	toggle_modal() {
		this.setState({ modalOpen: !this.state.modalOpen });
	}

	render() {
		var i = -1;
		const menu_items = _.map(this.props.tasks, (x) => {
			i++;
			return (
				<DropdownItem key={i} onClick={() => { this.change_current_task(i)}} >
					{x.name}
				</DropdownItem>
	  		)
		});

		return (
			<div>
				<DropdownMenu>
					{menu_items}
				</DropdownMenu>
				<InnerModal isOpen={this.state.modalOpen} task={this.state.current_task} toggle={this.toggle_modal} />
			</div>
		)
	}

}

export default Menu;
