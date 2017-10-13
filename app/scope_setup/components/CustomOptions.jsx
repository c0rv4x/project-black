import _ from 'lodash'
import React from 'react'

import { 
	Button
} from 'reactstrap'

import AdaptiveOption from '../presentational/AdaptiveOption.jsx'


class CustomOptions extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var options = [];

		_.forOwn(this.props.inputs, (value, key) => {
			options.push(
				<AdaptiveOption key={key}
								objectKey={key}
								value={value}
								onInputChange={this.props.onInputChange} />
			);
		});

		return (
			<div>
				{options}
				<Button color="primary" onClick={this.props.startTaskHandler}>Start Task</Button>
			</div>
		)
	}
}

export default CustomOptions;