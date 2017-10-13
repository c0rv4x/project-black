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

import { Card, CardHeader, CardFooter, CardBody,
  CardTitle, CardText } from 'reactstrap'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'

class IPEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const header = (
			<span><b>{this.props.ip.ip_address}</b></span>
		);

		const footer = (
			<div>
	            <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
					<Button>
						Verbose
					</Button>
	            </a>

				<Button color="danger" onClick={this.props.deleteScope}>
					Delete
				</Button>
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
				<CardFooter>
					{footer}
				</CardFooter>
			</Card>
		)	
	}
}

export default IPEntryLine;
