import React from 'react';
import { Button, Panel, Glyphicon } from 'react-bootstrap';


class ScopeEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var rendered_ip_address = null;
		if (this.props.scope.ip_address) {
			rendered_ip_address = (
				<span>{this.props.scope.ip_address}</span>
			)
		}

		const header = ( 
			<h3>
				{rendered_ip_address}
				<Glyphicon glyph="remove-circle" onClick={this.props.deleteScope} />
			</h3>
		)

		const ports = _.map(this.props.scans.sort((a, b) => {
			if (a["port_number"] > b["port_number"]) return 1;
			if (a["port_number"] < b["port_number"]) return -1;
			return 0;
		}), (x) => {
			return (
				<div key={x.scan_id + '_' + x.port_number}>{x.port_number} <span>{x.banner}</span></div>
			)
		})
		return (
			<div>
				<Panel header={header}>
					{ports}
				</Panel>
			</div>			

		)
	}
}

export default ScopeEntryLine;