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
	}

	changeInput(e) {
		this.props.onInputChange(this.props.objectKey, e.target.value);
	}

	render() {
		if (this.props.value.type === 'checkbox') {
			if (this.props.value.value === true) {
				return (
					<Checkbox defaultChecked>
						{_.capitalize(this.props.objectKey)}
					</Checkbox>
				)				
			}
			else {
				return (
					<Checkbox>
						{_.capitalize(this.props.objectKey)}
					</Checkbox>
				)				
			}
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