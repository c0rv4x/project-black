import _ from 'lodash'
import React from 'react'
import { Button, Modal, ModalBody, ModalHeader, DropdownItem, Tooltip } from 'reactstrap'

import CustomOptions from "./CustomOptions.jsx"


class TasksOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showModal: false,
			tooltipOpen: false,
			inputs: {}
		}

		this.toggle_modal = this.toggle_modal.bind(this);
		this.toggle_tooltip = this.toggle_tooltip.bind(this);

		this.startTask = this.startTask.bind(this);

		this.onInputChange = this.onInputChange.bind(this);
		this.loadOptions = this.loadOptions.bind(this);		
	}

	onInputChange(name, value) {
		// TODO: change this
		var inputs = this.state.inputs;
		inputs[name].value = value;

		this.setState({
			inputs: inputs
		});
	}

	componentDidMount() {
		var inputs = {};
		_.map(this.props.task.available_options, (x) => {
			inputs[x.name] = {
				type: x.type,
				value: x.default_value,
				default_value: x.default_value,
			};				
		});

		this.setState({
			inputs: inputs
		});
	}

	startTask() {
		console.log('starting task');
		var formedOptions = {};

		_.forOwn(this.state.inputs, (value, key) => {
			formedOptions[key] = value.value;
		});

		this.props.task.handler(formedOptions);
		this.close();
	}
	toggle_tooltip() {
		this.setState({
			tooltipOpen: !this.state.tooltipOpen
		});
	}

	toggle_modal(e) {
		this.setState({ showModal: !this.state.showModal });
	}

	loadOptions(options) {
		// TODO make change only on setState
		var inputs = {};

		_.forOwn(this.state.inputs, (value, key) => {
			inputs[key] = {
				type: value.type,
				value: value.default_value,
				default_value: value.default_value,
			};	
		});

		_.forOwn(options, (value, key) => {
			inputs[key] = {
				value: value
			};
		});

		this.setState({
			inputs: inputs
		});
	}

	render() {
		// const startButtons = _.map(this.props.task.preformed_options, (x) => {
		// 	var options = [];
		// 	_.forOwn(x.options, (value, key) => {
		// 		options.push(<div key={key}><strong>{key}:</strong> {value}</div>);
		// 	});

		// 	return (
		// 		<div key={x.name}>
		// 		    <Tooltip placement="top" target={"button_"+x.name} isOpen={this.state.tooltipOpen} toggle={this.toggle_tooltip}>
		// 		    	{options}
		// 		    </Tooltip>

		// 			<Button size="sm" id={"button_"+x.name} onClick={() => this.loadOptions(x.options)}>{x.name}</Button>
		// 		</div>
		// 	)
		// });

		const startButtons = [];

		return ( 
			<DropdownItem key={this.props.number}
					 	  onClick={this.toggle_modal} 
					 	  toggle={false}>

  		 	    {this.props.task.name}
				<Modal isOpen={this.state.showModal} toggle={this.toggle_modal} >

					<ModalBody>
						<h6>Choose one of the prepared options or create your own</h6>
						<hr />
						{startButtons}

						<br/>
						<CustomOptions inputs={this.state.inputs}
									   startTaskHandler={this.startTask}
									   onInputChange={this.onInputChange} />					
					</ModalBody>
				</Modal>

			</DropdownItem>
		)
	}
}

export default TasksOptions;