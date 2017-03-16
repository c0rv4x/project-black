import React from 'react';
import { Button } from 'react-bootstrap';


class ScopeEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<td>{this.props.scope.scope_id}</td>
				<td>{this.props.scope.hostname}</td>
				<td>{this.props.scope.ip_address}</td>
				<td><Button bsStyle="danger" onClick={this.props.deleteScope}>Delete</Button></td>
			</tr>
		)
	}
}

export default ScopeEntryLine;