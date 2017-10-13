import React from 'react'
import { 
	Button, 
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardText,
	CardTitle,
	Col,
	ListGroup,
	ListGroupItem,
	Row
} from 'reactstrap'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'

class IPEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const header = (
			<div>
				<span className="align-middle"><b>{this.props.ip.ip_address}</b></span>

				<span style={{float: 'right'}}>
		            <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
						<Button outline size="sm">
							Verbose
						</Button>
		            </a>

					<Button outline color="danger" size="sm" onClick={this.props.deleteScope}>
						Delete
					</Button>
				</span>
			</div>
		);

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
			<Card>
				<CardHeader color="primary">{header}</CardHeader>
				<CardBody>
					<CardText>Some Text</CardText>
				</CardBody>
				<ListGroup className="list-group-flush">
					{ports}
				</ListGroup>
			</Card>
		)	
	}
}

export default IPEntryLine;
