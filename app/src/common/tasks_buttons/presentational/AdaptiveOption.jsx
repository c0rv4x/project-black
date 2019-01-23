import _ from 'lodash'
import React from 'react'

import {
	CheckBox,
	FormField,
	TextArea
} from 'grommet'

import autosize from 'autosize'


class AdaptiveOption extends React.Component {
	constructor(props) {
		super(props);

		this.objectKey = null;

		this.changeInput = this.changeInput.bind(this);
	}

	changeInput(e) {
		this.props.onInputChange(this.props.objectKey, e.target.value);
	}

	triggerBool(newValue) {
		this.props.onInputChange(this.props.objectKey, newValue.target.checked);
	}

	componentDidUpdate() {
		if (this.input) {
			autosize(this.input);
		}
	}

	componentDidMount() {
		if (this.input) {
			autosize(this.input);
		}
	}

	render() {
		const { value, objectKey } = this.props;

		this.objectKey = objectKey;

		if (value.type === 'checkbox') {
			return (
				<CheckBox
					checked={value.value}
					onChange={this.triggerBool.bind(this)}
					label={objectKey && _.capitalize(objectKey)}
				/>
			)
		}
		else {
			return (
				<FormField label={_.capitalize(objectKey)} htmlFor={"text-area" + objectKey} >
					<TextArea
						ref={(input) => {
							this.input = input;
						}}
						rows={1}
						style={{ resize: 'none' }}
						id={"text-area-" + objectKey}
						type={value.type}
						placeholder={objectKey}
						value={value.value}
						onChange={this.changeInput}
					/>
				</FormField>
			)
		}
	}
}

export default AdaptiveOption;