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
		var nice_options = _.map(this.props.available_options, (x) => {
			return (
				<div key={x.display_name}>
					<Form inline>
						<FormGroup controlId="formInlineName">
							<ControlLabel>{x.display_name}</ControlLabel>
							{' '}
							<FormControl type="text" placeholder="Jane Doe" />
						</FormGroup>
					</Form>
				</div>
			)
		});

		return <div>{nice_options}</div>
	}
}

export default CustomOptions;