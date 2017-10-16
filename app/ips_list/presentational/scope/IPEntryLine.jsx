import React from 'react'
// import { 
// 	Button, 
// 	Card,
// 	CardBody,
// 	CardFooter,
// 	CardHeader,
// 	CardText,
// 	CardTitle,
// 	Col,
// 	ListGroup,
// 	ListGroupItem,
// 	Row
// } from 'reactstrap'

import {
	Button,
	Card,
	Grid,
	Segment
} from 'semantic-ui-react'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'


class IPEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const header = (
			<b>{this.props.ip.ip_address}</b>
		);

		const footer = (
			<div>
	            <a onClick={() => window.open(verbose_host_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
					<Button basic size="tiny">
						Verbose
					</Button>
	            </a>

				<Button basic color="red" size="tiny" onClick={this.props.deleteScope}>
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
				<Grid.Row key={x.scan_id + '_' + x.port_number}>
					<Grid.Column>{x.port_number}</Grid.Column>
					<Grid.Column>{x.protocol}</Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column></Grid.Column>
					<Grid.Column>{x.banner}</Grid.Column>
				</Grid.Row>
			)
		});

		const description = (
			<div>			
				<ScopeComment comment={this.props.ip.comment}
						  	  onCommentSubmit={this.props.onCommentSubmit} />
				<Grid columns={12}>
					{ports}
				</Grid>				
			</div>
		)

		return (
			<Card fluid>
				<Card.Content header={header} />
				<Card.Content description={description} />
				<Card.Content extra>{footer}</Card.Content>
			</Card>			

		)	
	}
}

export default IPEntryLine;
