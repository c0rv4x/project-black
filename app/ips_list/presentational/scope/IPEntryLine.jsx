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
			const verbose_host_link = '/project/' + this.props.project_uuid + '/ip/' + this.props.ip.ip_address;

			rendered_ip_address = (
				<div>
					<span><b>{this.props.ip.ip_address}</b></span>
					<div className="pull-right">
	                    <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
							<Button bsStyle="default" bsSize="small">
								<Glyphicon glyph="zoom-in"/>
							</Button>					
	                    </a>

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
						<ul>
							<li>Hosts: <strong>{this.props.ip.hostnames.join(', ')}</strong></li>
							<li>Comment: <ScopeComment comment={this.props.ip.comment}
									  				   onCommentSubmit={this.props.onCommentSubmit}/>
							</li>
						</ul>				
					</ListGroupItem>
					{ports}
				</ListGroup>		
			</Panel>
		)
	}
}

export default IPEntryLine;
