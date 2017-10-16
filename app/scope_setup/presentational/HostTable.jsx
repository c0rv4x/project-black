import React from 'react'

import { Table, Button } from 'semantic-ui-react'


class HostTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const hosts_rendered = _.map(this.props.hosts, (x) => {
			return (
				<Table.Row key={x._id}> 
					<Table.Cell>{x.hostname}</Table.Cell>
					<Table.Cell>{x.ip_addresses.join(", ")}</Table.Cell>
					<Table.Cell><Button color="red" onClick={() => {this.props.delete(x._id)}}>Delete</Button></Table.Cell>
				</Table.Row>
			)
		});

		return (
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Hostname</Table.HeaderCell>
						<Table.HeaderCell>Resolved to </Table.HeaderCell>
						<Table.HeaderCell>Control</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{hosts_rendered}
				</Table.Body>
			</Table>
		)
	}
}

export default HostTable;
