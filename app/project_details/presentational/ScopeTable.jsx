import _ from 'lodash';
import React from 'react';
import { Table, Button } from 'react-bootstrap';

import ScopeEntryLine from './ScopeEntryLine.jsx';


class ScopeTable extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const scopes = _.map(this.props.scopes, (x) => {
			return <ScopeEntryLine scope={x}/>
		});

		return (
			<Table bordered>
				<thead>
					<tr>
						<td>Scope UUID</td>
						<td>Hostname</td>
						<td>IP</td>
						<td>Control</td>
						<td><Button bsStyle="danger">Delete</Button></td>
					</tr>
				</thead>
				<tbody>
					{scopes}
				</tbody>
			</Table>
		)
	}

}

export default ScopeTable;