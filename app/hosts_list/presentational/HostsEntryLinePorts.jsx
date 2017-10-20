import React from 'react'
import {
	Grid,
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
					<Grid.Row key={x.scan_id + '_' + x.port_number}>
						<Grid.Column>{x.port_number}</Grid.Column>
						<Grid.Column>{x.protocol}</Grid.Column>
						<Grid.Column width={10}>{x.banner}</Grid.Column>
					</Grid.Row>
				)
			});

			return (
				<Grid columns={12} key={this.props.host._id} >
					<Header>{ip_address.ip_address}</Header>{ports_nice}
				</Grid>
			);
		});

		return (
			<div>
				{ports.length !== 0 && <Divider />}
				{ports.length !== 0 && <br />}
				{ports}
			</div>
		)
	}
}

export default HostsEntryLinePorts;
