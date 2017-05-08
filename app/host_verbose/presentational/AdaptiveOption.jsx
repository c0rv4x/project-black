import _ from 'lodash'
import React from 'react'

import { 
	Button,
	FormGroup,
	ControlLabel,
	FormControl,
	Checkbox
} from 'react-bootstrap'


class AdaptiveOption extends React.Component {
	constructor(props) {
		super(props);

		this.changeInput = this.changeInput.bind(this);
		this.triggerBool = this.triggerBool.bind(this);
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
				<Checkbox checked={this.props.value.value} onChange={this.triggerBool}>
					{_.capitalize(this.props.objectKey)}
				</Checkbox>
			)				
		}
		else {
			return (
				<div>
					<ControlLabel>{_.capitalize(this.props.objectKey)}</ControlLabel>
					<FormGroup controlId="formInlineName">
						<FormControl type={this.props.value.type}
									 placeholder={this.props.objectKey}
									 value={this.props.value.value}
									 onChange={this.changeInput}
									 />
					</FormGroup>
				</div>
			)
		}
	}
}

export default AdaptiveOption;