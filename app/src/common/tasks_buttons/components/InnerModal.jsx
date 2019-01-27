import _ from 'lodash'
import React from 'react'

import {
	Box,
	Button,
	Layer,
	Text
} from 'grommet'

import Dictionaries from './Dictionaries.jsx'
import CustomOptions from './CustomOptions.jsx'


class InnerModal extends React.Component {

	constructor(props) {
		super(props);

		let inputs = {};
		_.map(this.props.task.available_options, (x) => {
			inputs[x.name] = {
				type: x.type,
				value: x.default_value,
				default_value: x.default_value,
			};				
		});

		this.state = {
			inputs: inputs
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
			return (
				<Button
					size="small"
					key={"button_" + x.name}
					onClick={() => this.loadOptions(x.options)}
					label={x.name}
				/>
			)
		});

		return (
			<Layer
				position="center"
				modal
				onClickOutside={closeModal}
				onEsc={closeModal}
			>
				<Box pad="medium" gap="small" >
					<Box direction="row" align="center" gap="small" pad="xsmall">
						{startButtons}
					</Box>
			 		{
			 			task.help && 
			 			task.help.map((help_notice) => {
			 				if (help_notice.condition === true) {
								let borderProps = {};
			 					if (help_notice.type == 'warning') {
									borderProps = {
										border: {
											size: "medium",
											color: "status-warning"
										},
										round: "xsmall"
									}
								}
								else if (help_notice.type == 'info') {
									borderProps = {
										border: {
											size: "medium",
											color: "accent-1"
										},
										background: "accent-1",
										round: "xsmall"
									}
								}

								return (
									<Box
										{...borderProps}
										key={"help-" + task.help.indexOf(help_notice)}
									>
										<Text size="small">{help_notice.text}</Text>
									</Box>
								);
			 				}
			 			})
			 		}
					<CustomOptions
						inputs={this.state.inputs}
						onInputChange={this.onInputChange}
					/>
			 		{ task.dictionaries_available && 
			 			<Dictionaries
			 				project_uuid={this.props.project_uuid}
			 				name={task.name.toLowerCase()}
			 				dicts={this.props.dicts}
			 			/>
			 		}
					<Button label="Fire!" onClick={this.startTask} />
				</Box>
			</Layer>
		)
	}

}

export default InnerModal;




