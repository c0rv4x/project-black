import React from 'react';
import { Button } from 'react-bootstrap';


class ScopeEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<th>{this.props.scope.scope_id}</th>
				<th>{this.props.scope.hostname}</th>
				<th>{this.props.scope.ip_address}</th>
				<th><Button bsStyle="danger" onClick={this.props.deleteScope}>Delete</Button></th>
			</tr>
		)
	}
}

export default ScopeEntryLine;