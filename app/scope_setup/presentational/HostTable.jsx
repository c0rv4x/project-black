import React from 'react'

import { Table } from 'react-bootstrap'


class HostTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const hosts_rendered = _.map(this.props.hosts, (x) => {
			return (
				<tr key={x._id}> 
					<td>{x.hostname}</td>
					<td>{x.ip_address}</td>
					<td>Some buttons</td>
				</tr>
			)
		});

		return (
			<Table bordered>
				<thead>
					<tr>
						<td>Hostname</td>
						<td>IP address</td>
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