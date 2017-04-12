import _ from 'lodash'
import React from 'react'

import { Table, Button } from 'react-bootstrap'


class IPTable extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const ips_rendered = _.map(this.props.ips, (x) => {
			return (
				<tr key={x._id}> 
					<td>{x.ip_address}</td>
					<td><Button onClick={() => this.props.delete(x._id)}>Delete</Button></td>
				</tr>
			)
		});

		return (
			<Table bordered>
				<thead>
					<tr>
						<td>IP address</td>
						<td>Control</td>
					</tr>
				</thead>
				<tbody>
					{ips_rendered}
				</tbody>
			</Table>
		)
	}
}

export default IPTable;
