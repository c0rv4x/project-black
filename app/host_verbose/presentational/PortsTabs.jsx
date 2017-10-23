import _ from 'lodash'
import React from 'react'
// import { Tab, Col, Row, Nav, NavItem, Table } from 'react-bootstrap'
import { Tab, Table } from 'semantic-ui-react'


class PortsTabs extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.tabChange(0);
	}

	render() {
		var i = 0;
		const navItems = _.map(this.props.ports, (x) => {
			return (
				<NavItem eventKey={i++} key={x.port_number}>
					{x.port_number}
				</NavItem>
			);
		});

		i = 0;
		const tabPanes = _.map(this.props.ports, (x) => {
			var filtered_files = _.filter(this.props.files, (y) => {
				return x.port_number == y.port_number;
			});

			filtered_files = filtered_files.sort((a, b) => {
				if (a.status_code > b.status_code) return 1;
				if (a.status_code < b.status_code) return -1;
				return 0;
			});

			return (
				<Tab.Pane eventKey={i++} key={x.port_number}>
					{
						<Table bordered condensed hover>
							<tbody>
								{
									_.map(filtered_files, (x) => {
										var result = Math.floor(x.status_code / 100)
										if (result == 2) {
											return <tr key={x.file_id}>
														<td style={{'color': '#22CF22'}}>{x.status_code}</td>
														<td>{x.content_length}</td>
														<td><a href={x.file_path} target="_blank">{x.file_name}</a></td>
														<td></td>
												   </tr>
										}
										else {
											return <tr key={x.file_id}>
														<td>{x.status_code}</td>
														<td>{x.content_length}</td>
														<td><a href={x.file_path} target="_blank">{x.file_name}</a></td>
														<td>{x.special_note &&x.special_note}</td>
												   </tr>
										}
									})
								}
							</tbody>
						</Table>
					}
				</Tab.Pane>
			)
		});

		return (
			<Tab.Container id="ports_tab_container"
						   activeKey={this.props.activeTabNumber}
						   onSelect={(newTabNumber) => {
							   	this.props.tabChange(newTabNumber, this.props.ports[newTabNumber].port_number);
							 }
						   } >
				<Row className="clearfix">
					<Col md={2} sm={2}>
						<Nav bsStyle="pills" stacked>
							{navItems}
						</Nav>
					</Col>
					<Col md={10} sm={10}>
						<Tab.Content animation>
							{tabPanes}
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		)
	}
}

export default PortsTabs;
