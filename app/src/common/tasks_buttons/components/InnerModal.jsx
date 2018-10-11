import _ from 'lodash'
import React from 'react'
import {
	Modal,
	Button,
	Popup,
	Message,
	Divider
} from 'semantic-ui-react'

import Dictionaries from './Dictionaries.jsx'
import CustomOptions from './CustomOptions.jsx'


class InnerModal extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			inputs: {}
		}

		this.loadOptions = this.loadOptions.bind(this);
		this.startTask = this.startTask.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(prevProps, this.props)) {
			let inputs = {};
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
		let inputs = JSON.parse(JSON.stringify(this.state.inputs));
		inputs[name].value = value;

		this.setState({
			inputs: inputs
		});
	}

	render() {
		const { task, open, openModal, closeModal } = this.props;

		const startButtons = _.map(task.preformed_options, (x) => {
			let options = [];
			_.forOwn(x.options, (value, key) => {
				options.push(<div key={key}><strong>{key}:</strong> {value}</div>);
			});

			let button = (
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
			<Modal open={open} onOpen={openModal} onClose={closeModal} >
				<Modal.Header>
					Choose one of the prepared options or create your own
				</Modal.Header>

				<Modal.Content>
					{startButtons}
					<Divider hidden />
					{
						task.help && 
						task.help.map((help_notice) => {
							if (help_notice.condition === true) {
								if (help_notice.type == 'warning') {
									return (
										<Message
											warning
											key={task.help.indexOf(help_notice)}
										>
											{help_notice.text}
										</Message>
									);
								}
								else {
									return (
										<Message
											key={task.help.indexOf(help_notice)}
										>
											{help_notice.text}
										</Message>
									);
								}
							}
						})
					}
					<Divider hidden />
					<CustomOptions inputs={this.state.inputs}
								   onInputChange={this.onInputChange} />
					{ task.dictionaries_available && 
						<Dictionaries
							project_uuid={this.props.project_uuid}
							name={task.name.toLowerCase()}
							dicts={this.props.dicts}
						/>
					}
					<Button color="blue" onClick={this.startTask}>Start Task</Button>
				</Modal.Content>
			</Modal>
		)
	}

}

export default InnerModal;




