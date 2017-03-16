import React from 'react';


class ScopeEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<td>this.props.scope.scope_id</td>
				<td>this.props.scope.hostname</td>
				<td>this.props.scope.IP</td>
				<td><Button bsStyle="danger">Delete</Button></td>
			</tr>
		)
	}
}