import React from 'react'

import { Table } from 'react-bootstrap'


class IPTable extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Table bordered>
				<thead>
					<tr>
						<td>IP address</td>
						<td>Control</td>
					</tr>
				</thead>
			</Table>
		)
	}
}

export default IPTable;