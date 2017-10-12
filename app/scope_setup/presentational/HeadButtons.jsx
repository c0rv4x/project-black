import React from 'react'

import { Button } from 'reactstrap'


class HeadButtons extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Button onClick={() => this.props.resolveScopes(null, this.props.project.project_uuid)}
					color="primary">
				Resolve Scopes
			</Button>
		)
	}
}

export default HeadButtons;
