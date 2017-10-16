import _ from 'lodash'
import React from 'react'

import { Table, Button } from 'semantic-ui-react'


class IPTable extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const ips_rendered = _.map(this.props.ips, (x) => {
			return (
				<Table.Row key={x._id}> 
					<Table.Cell>{x.ip_address}</Table.Cell>
					<Table.Cell><Button color="red" onClick={() => this.props.delete(x._id)}>Delete</Button></Table.Cell>
				</Table.Row>
			)
		});

		return (
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>IP address</Table.HeaderCell>
						<Table.HeaderCell>Control</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{ips_rendered}
				</Table.Body>
			</Table>			
		)
	}
}

export default IPTable;
