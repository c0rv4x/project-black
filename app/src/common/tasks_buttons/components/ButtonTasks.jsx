import _ from 'lodash'
import React from 'react'
import { Dropdown, Icon, Popup } from 'semantic-ui-react';
import { Box, Heading, Text, Button, DropButton } from 'grommet'
import { Close } from 'grommet-icons'

import InnerModal from './InnerModal.jsx'
import DropButtonContent from './DropButtonContent.jsx'



class ButtonTasks extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			current_task: {
				name: "",
				preformedOptions: [],
				availableOptions: [],
				handler: (() => {})
			},
			dropDownOpen: false,
			modalOpen: false
		};

		this.change_current_task.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
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
		const { tasks } = this.props;

		return (
			<span>
				<DropButton
					label="Launch Task"
					open={this.state.dropDownOpen}
					onOpen={() => this.setState({ dropDownOpen: true })}
					onClose={() => this.setState({ dropDownOpen: false })}
					dropContent={
						<DropButtonContent tasks={tasks} />
					}
				/>
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

export default ButtonTasks;