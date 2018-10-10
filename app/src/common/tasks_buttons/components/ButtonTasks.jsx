import _ from 'lodash'
import React from 'react'
import { Dropdown } from 'semantic-ui-react';

import InnerModal from './InnerModal.jsx'


class ButtonsTasks extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			current_task: {
				name: "",
				preformedOptions: [],
				availableOptions: [],
				handler: (() => {})
			},
			modalOpen: false
		};

		this.change_current_task.bind(this);	
	}

	change_current_task(task) {
		this.setState({
			current_task: task
		});

		this.openModal();
	}

	openModal() {
		this.setState({
			modalOpen: true
		});
	}

	closeModal() {
		this.setState({
			modalOpen: false
		});
	}

	render() {
		var i = -1;
		const items = this.props.tasks.map((task) => {
			i++;
			return (
				<Dropdown.Item key={i} onClick={() => { this.change_current_task(task)}} >
					{task.name}
				</Dropdown.Item>
			)
		});

		return (
			<span>
				<Dropdown text="Launch Task" button>
					<Dropdown.Menu>
						{items}
					</Dropdown.Menu>
				</Dropdown>
				<InnerModal
					project_uuid={this.props.project_uuid}
					dicts={this.props.dicts}
					open={this.state.modalOpen}
					task={this.state.current_task}
					openModal={this.openModal.bind(this)}
					closeModal={this.closeModal.bind(this)}
				/>
			</span>
		)
	}

}

export default ButtonsTasks;