import React from 'react'

import { Table, Button } from 'react-bootstrap'


class HostTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const hosts_rendered = _.map(this.props.hosts, (x) => {
			return (
				<tr key={x._id}> 
					<td>{x.hostname}</td>
					<td>{x.ip_addresses.join(", ")}</td>
					<td><Button onClick={() => this.props.delete(x._id)}>Delete</Button></td>
				</tr>
			)
		});

		return (
			<Table bordered>
				<thead>
					<tr>
						<td>Hostname</td>
						<td>Resolved to </td>
						<td>Control</td>
					</tr>
				</thead>
				<tbody>
					{hosts_rendered}
				</tbody>
			</Table>
		)
	}
}

export default HostTable;
