import _ from 'lodash'
import React from 'react'

import { 
	Button,
	Checkbox,
	Form,
	TextArea
} from 'semantic-ui-react'


class AdaptiveOption extends React.Component {
	constructor(props) {
		super(props);

		this.changeInput = this.changeInput.bind(this);
	}

	changeInput(e) {
		this.props.onInputChange(this.props.objectKey, e.target.value);
	}

	triggerBool(newValue) {
		this.props.onInputChange(this.props.objectKey, newValue.target.checked);
	}

	render() {
		if (this.props.value.type === 'checkbox') {
			return (
				<Form.Field>
					<Checkbox checked={this.props.value.value}
							  onChange={this.triggerBool.bind(this)}
							  label={this.props.objectKey && _.capitalize(this.props.objectKey)} />
				</Form.Field>
			)				
		}
		else {
			return (
				<Form.Field>
					<label>{_.capitalize(this.props.objectKey)}</label>
					<TextArea 
						autoHeight
						rows={1}
						type={this.props.value.type}
						placeholder={this.props.objectKey}
						value={this.props.value.value}
						onChange={this.changeInput} />
				</Form.Field>
			)
		}
	}
}

export default AdaptiveOption;