import React from 'react'
import {
	Table,
	Header,
	Divider
} from 'semantic-ui-react'


class HostsEntryLinePorts extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const ports = _.map(this.props.host.ip_addresses, (ip_address) => {
			const ports_filtered = ip_address.scans;

			const ports_sorted = ports_filtered.sort((a, b) => {
				if (a["port_number"] > b["port_number"]) return 1;
				if (a["port_number"] < b["port_number"]) return -1;
				return 0;
			});

			const ports_nice = _.map(ports_sorted, (x) => {
				return (
					<Table.Row key={x.scan_id + '_' + x.port_number}>
						<Table.Cell>{x.port_number}</Table.Cell>
						<Table.Cell>{x.protocol}</Table.Cell>
						<Table.Cell width={10}>{x.banner}</Table.Cell>
					</Table.Row>
				)
			});

			return (
				<div key={this.props.host._id + ip_address.ip_address} >
					<Header>{ip_address.ip_address}</Header>
					<Table basic="very">
						<Table.Body>
							{ports_nice}
						</Table.Body>
					</Table>
					{this.props.host.ip_addresses.indexOf(ip_address) < this.props.host.ip_addresses.length - 1 && <br />}
				</div>
			);
		});

		return (
			<div>
				<Divider hidden />
				{ports.length !== 0 && <Divider />}
				{ports.length !== 0 && <br />}
				{ports}
			</div>
		)
	}
}

export default HostsEntryLinePorts;
