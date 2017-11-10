import _ from 'lodash'
import React from 'react'

import { Table, Button, Label, Transition } from 'semantic-ui-react'


class IPTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false
		}

		this.toggleVisibility.bind(this);
	}

	toggleVisibility() {
		this.setState({ visible: !this.state.visible });
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

		let visible = this.state.visible;

		return (
			<span>
				<Label onClick={this.toggleVisibility.bind(this)} size="large" color="blue">
					{ips_rendered.length} ips
				</Label>
				<Transition visible={visible} animation='scale' duration={500}>
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
				</Transition>
			</span>
		)
	}
}

export default IPTable;
