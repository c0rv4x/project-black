import React from 'react'

import {
	Segment,
	Checkbox
} from 'semantic-ui-react'


class Settings extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Segment vertical>
				<Checkbox label="Test" />
			</Segment>
		)
	}
}


export default Settings;