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

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'

class IPEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var rendered_ip_address = null;
		if (this.props.ip.ip_address) {
			rendered_ip_address = (
				<div>
					<span><b>{this.props.ip.ip_address}</b></span>
					<div className="pull-right">
						<Button bsStyle="danger" bsSize="small" onClick={this.props.deleteScope}>
							<Glyphicon glyph="remove"/>
						</Button>
					</div>	
				</div>			
			)
		}

		const ports = _.map(this.props.ip.scans.sort((a, b) => {
			if (a["port_number"] > b["port_number"]) return 1;
			if (a["port_number"] < b["port_number"]) return -1;
			return 0;
		}), (x) => {
			return (
				<ListGroupItem key={x.scan_id + '_' + x.port_number}>
					<Row>
						<Col md={1}>{x.port_number}</Col>
						<Col md={1}>{x.protocol}</Col>
						<Col md={10}>{x.banner}</Col>
					</Row>
				</ListGroupItem>
			)
		});

		return (
			<Panel defaultExpanded header={rendered_ip_address || this.props.ip.hostname} bsStyle="primary">
				<ListGroup fill>
					<ListGroupItem>
						<ScopeComment commentValue={this.props.ip.comment}
									  onCommentSubmit={this.props.onCommentSubmit}/>
					</ListGroupItem>
					{ports}
				</ListGroup>		
			</Panel>
		)
	}
}

export default IPEntryLine;
