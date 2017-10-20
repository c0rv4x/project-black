import React from 'react'

import { Button } from 'semantic-ui-react'


class FilteringButtons extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var buttons = this.props.options.map((option) => {
			return <Button key={option.id} onClick={option.handler}>{option.name}</Button>
		});

		return (
			<div>
				{buttons}
			</div>
		)
	}
}

export default FilteringButtons;