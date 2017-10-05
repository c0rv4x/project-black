import _ from 'lodash'
import React from 'react'
import { Button, Modal, MenuItem, OverlayTrigger, Popover } from 'react-bootstrap'

import CustomOptions from "./CustomOptions.jsx"


class TasksOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showModal: false,
			inputs: {}
		}

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);

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

	close() {
		this.setState({ showModal: false });
	}	

	open() {
		this.setState({ showModal: true });
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
		const startButtons = _.map(this.props.task.preformed_options, (x) => {
			var options = [];
			_.forOwn(x.options, (value, key) => {
				options.push(<div key={key}><strong>{key}:</strong> {value}</div>);
			});

			const popover = (
				<Popover id="popover-trigger-hover-focus" title="Options">
					{options}
				</Popover>
			);

			return (
			    <OverlayTrigger key={x.name} trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
					<Button onClick={() => this.loadOptions(x.options)}>{x.name}</Button>
			    </OverlayTrigger>
			)
		});

		return ( 
			<MenuItem key={this.props.number}
					  eventKey={this.props.number}
					  onClick={this.open} >

				{this.props.task.name}
				<Modal show={this.state.showModal} onHide={this.close} >
					<Modal.Header closeButton>
						<Modal.Title>Prepared settings</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Choose one of the prepared options or create your own</h4>
						{startButtons}
						<hr />
						<CustomOptions inputs={this.state.inputs}
									   startTaskHandler={this.startTask}
									   onInputChange={this.onInputChange} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
			</MenuItem>
		)
	}
}

export default TasksOptions;