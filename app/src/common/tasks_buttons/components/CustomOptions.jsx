import _ from 'lodash'
import React from 'react'

import { 
	Button,
	Form
} from 'semantic-ui-react'

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
				<Form>		
					{options}
					<Button color="blue" onClick={() => {console.log('starting');this.props.startTaskHandler();}}>Start Task</Button>
				</Form>
			</div>
		)
	}
}

export default CustomOptions;