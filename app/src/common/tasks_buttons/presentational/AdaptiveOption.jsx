import _ from 'lodash'
import React from 'react'

import { 
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
		const { value, objectKey } = this.props;

		if (value.type === 'checkbox') {
			return (
				<Form.Field>
					<Checkbox checked={value.value}
							  onChange={this.triggerBool.bind(this)}
							  label={objectKey && _.capitalize(objectKey)} />
				</Form.Field>
			)
		}
		else {
			return (
				<Form.Field>
					<label>{_.capitalize(objectKey)}</label>
					<TextArea 
						autoHeight
						rows={1}
						type={value.type}
						placeholder={objectKey}
						value={value.value}
						onChange={this.changeInput} />
				</Form.Field>
			)
		}
	}
}

export default AdaptiveOption;