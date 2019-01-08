import _ from 'lodash'
import React from 'react'


import AdaptiveOption from '../presentational/AdaptiveOption.jsx'


class CustomOptions extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var options = [];
		console.log(this.props.inputs);

		_.forOwn(this.props.inputs, (value, key) => {
			options.push(
				<AdaptiveOption
					key={key}
					objectKey={key}
					value={value}
					onInputChange={this.props.onInputChange}
				/>
			);
		});
		return (
			<div>	
				{options}
			</div>
		)
	}
}

export default CustomOptions;