import React from 'react'

import { Button } from 'react-bootstrap'


class HeadButtons extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Button onClick={() => this.props.resolveScopes(null, this.props.project.project_uuid)}
						bsStyle="primary">
					Resolve Scopes
				</Button>
				<br/>
				<br/>
			</div>
		)
	}
}

export default HeadButtons;