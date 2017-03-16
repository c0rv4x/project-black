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
			return <ScopeEntryLine key={x.scope_id} 
								   scope={x} 
								   deleteScope={() => this.props.deleteScope(x.scope_id)}/>
		});

		return (
			<Table bordered>
				<thead>
					<tr>
						<td>Scope UUID</td>
						<td>Hostname</td>
						<td>IP</td>
						<td>Control</td>
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