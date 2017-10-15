import React from 'react'
import { 
	Button, 
	Panel, 
	Glyphicon,
	ListGroup,
	ListGroupItem,
	Row,
	Col
} from 'reactstrap'


class HostsEntryLinePorts extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var ports = [];
		for (var ip_address of this.props.host.ip_addresses) {
			const ports_filtered = ip_address.scans;

			const ports_sorted = ports_filtered.sort((a, b) => {
				if (a["port_number"] > b["port_number"]) return 1;
				if (a["port_number"] < b["port_number"]) return -1;
				return 0;
			});

			var ports_nice = _.map(ports_sorted, (x) => {
				return (
						<Row key={x.scan_id + '_' + x.port_number}>
							<Col md={1}>{x.port_number}</Col>
							<Col md={1}>{x.protocol}</Col>
							<Col md={10}>{x.banner}</Col>
						</Row>
				)
			});

			ports.push(
				<ListGroupItem key={this.props.host._id + "_" + ip_address.ip_address}>
					<h5>{ip_address.ip_address}</h5>{ports_nice}
				</ListGroupItem>);
		}

		return (
			<ListGroup className="list-group-flush">
				{ports}
			</ListGroup>
		)
	}
}

export default HostsEntryLinePorts;
