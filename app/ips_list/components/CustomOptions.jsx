import _ from 'lodash'
import React from 'react'

import { 
	Button,
	Form,
	FormGroup,
	ControlLabel,
	FormControl
} from 'react-bootstrap'


class CustomOptions extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<FormGroup controlId="formInlineName">
					<FormControl type="text"
								 placeholder="Flags and parameters"
								 value={this.props.inputValue} 
								 onChange={(x) => this.props.onOptionsInputChange(x.target.value)} />
				</FormGroup>
				<Button bsStyle="primary" onClick={this.props.startTaskHandler}>Start Task</Button>
			</div>
		)
	}
}

export default CustomOptions;