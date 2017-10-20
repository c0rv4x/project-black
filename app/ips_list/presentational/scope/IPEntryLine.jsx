import React from 'react'

import {
	Button,
	Card,
	Table,
	Header,
	Divider
} from 'semantic-ui-react'

import ScopeComment from '../../../common/scope_comment/ScopeComment.jsx'


class IPEntryLine extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
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
				<Table.Row key={x.scan_id + '_' + x.port_number}>
					<Table.Cell>{x.port_number}</Table.Cell>
					<Table.Cell>{x.protocol}</Table.Cell>
					<Table.Cell>{x.banner}</Table.Cell>
				</Table.Row>
			)
		});

		const description = (
			<div>
				<Header>{this.props.ip.ip_address}</Header>
				<Divider/>
				<ScopeComment comment={this.props.ip.comment}
						  	  onCommentSubmit={this.props.onCommentSubmit} />

				<Table basic="very">
					<Table.Body>
						{ports}
					</Table.Body>
				</Table>
			</div>
		)

		return (
			<Card color="blue">
				<Card.Content description={description} />
				<Card.Content extra>{footer}</Card.Content>
			</Card>	
		)	
	}
}

export default IPEntryLine;