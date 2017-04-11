import React from 'react'
import { 
	Button, 
	Panel, 
	Glyphicon,
	ListGroup,
	ListGroupItem,
	Row,
	Col
} from 'react-bootstrap'


class HostsEntryLinePorts extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var rendered_hostname = null;
		if (this.props.scope.hostname) {
			rendered_hostname = (
				<span>{this.props.scope.hostname}
				<Glyphicon glyph="remove-circle" onClick={this.props.deleteScope} /></span>
			)
		}

		const header = ( 
			<h3>
				{rendered_hostname}
			</h3>
		)

		var ports = [];
		for (var ip_address of this.props.scope.ip_addresses) {
			const ports_filtered = _.filter(this.props.scans, (x) => {
				return x["target"] == ip_address;
			});

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
				<ListGroupItem key={this.props.scope._id + "_" + ip_address}>
					<h5>{ip_address}</h5>{ports_nice}
				</ListGroupItem>);
		}

		return (
			<div>
				{ports}
			</div>
		)
	}
}

export default HostsEntryLinePorts;