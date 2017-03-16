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
			return <ScopeEntryLine key={x.scope_id} scope={x}/>
		});

		return (
			<Table bordered>
				<thead>
					<tr>
						<th>Scope UUID</th>
						<th>Hostname</th>
						<th>IP</th>
						<th>Control</th>
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