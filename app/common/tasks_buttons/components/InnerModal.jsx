import _ from 'lodash'
import React from 'react'
import { Modal, Button, Popup } from 'semantic-ui-react'


import CustomOptions from './CustomOptions.jsx'


class InnerModal extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			inputs: {}
		}

		this.loadOptions = this.loadOptions.bind(this);
		this.startTask = this.startTask.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		var inputs = {};
		_.map(nextProps.task.available_options, (x) => {
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
		var formedOptions = {};

		_.forOwn(this.state.inputs, (value, key) => {
			formedOptions[key] = value.value;
		});

		this.props.task.handler(formedOptions);
		this.props.closeModal();
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

	onInputChange(name, value) {
		// TODO: change this
		var inputs = this.state.inputs;
		inputs[name].value = value;

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

			var button = (
				<span>
					<Button size="small"
					        id={"button_" + x.name}
					        onClick={() => this.loadOptions(x.options)}>
					        {x.name}
			        </Button>
				</span>
			);

			return (
				<Popup key={x.name} trigger={button}>
					{options}
				</Popup>
			)
		});

		return (
			<Modal open={this.props.open} onOpen={this.props.openModal} onClose={this.props.closeModal} >
				<Modal.Header>
					Choose one of the prepared options or create your own
				</Modal.Header>

				<Modal.Content>
					{startButtons}

					<br/>
					<br/>
					<CustomOptions inputs={this.state.inputs}
								   startTaskHandler={this.startTask}
								   onInputChange={this.onInputChange} />					
				</Modal.Content>
			</Modal>
		)
	}

}

export default InnerModal;




