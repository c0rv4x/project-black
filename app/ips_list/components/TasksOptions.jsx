import _ from 'lodash'
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem } from 'reactstrap'

import CustomOptions from "./CustomOptions.jsx"


class TasksOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modal: false,
			inputs: {}
		}

		this.toggle = this.toggle.bind(this);

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
				text: x.text
			};				
		});

		this.setState({
			inputs: inputs
		});
	}

	startTask() {
		var formedOptions = {};

		_.forOwn(this.state.inputs, (value, key) => {
			formedOptions[key] = value.value;
		});

		this.props.task.handler(formedOptions);
		this.close();
	}

	toggle() {
		console.log(this.state.modal, !this.state.modal);
		this.setState({
			modal: true
	    }, function () {
	    	console.log("updated",this.state);
	    });

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
		console.log(this.state.modal);
		// const startButtons = _.map(this.props.task.preformed_options, (x) => {
		// 	var options = [];
		// 	_.forOwn(x.options, (value, key) => {
		// 		options.push(<div key={key}><strong>{key}:</strong> {value}</div>);
		// 	});

		// 	const popover = (
		// 		<Popover id="popover-trigger-hover-focus" title="Options">
		// 			{options}
		// 		</Popover>
		// 	);

		// 	return (
		// 	    <OverlayTrigger key={x.name} trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
		// 			<Button onClick={() => this.loadOptions(x.options)}>{x.name}</Button>
		// 	    </OverlayTrigger>
		// 	)

		// 				{startButtons}
		// 				<hr />
		// 				<CustomOptions inputs={this.state.inputs}
		// 							   startTaskHandler={this.startTask}
		// 							   onInputChange={this.onInputChange} />			
		// });

		return ( 
			<DropdownItem key={this.props.number}
						  onClick={this.toggle} >

				{this.props.task.name}
				<Modal isOpen={this.state.modal} toggle={this.toggle} >
					<ModalHeader toggle={this.toggle}>
						Prepared settings
					</ModalHeader>
					<ModalBody>
						<h4>Choose one of the prepared options or create your own</h4>

					</ModalBody>
					<ModalFooter>
						<Button onClick={this.toggle}>Close</Button>
					</ModalFooter>
				</Modal>
			</DropdownItem>
		)
	}
}

export default TasksOptions;