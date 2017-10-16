import React from 'react'

import { Button } from 'semantic-ui-react'


class HeadButtons extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Button onClick={this.props.resolveScopes}
					color="blue">
				Resolve Scopes
			</Button>
		)
	}
}

export default HeadButtons;
