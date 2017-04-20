import _ from 'lodash'
import React from 'react'
import { Tab, Col, Row, Nav, NavItem } from 'react-bootstrap'


class PortsTabs extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var i = 0;
		const navItems = _.map(this.props.ports, (x) => {
			i++;
			return (
				<NavItem eventKey={x.port_number} key={x.port_number}>
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
				if (a.file_name > b.file_name) return 1;
				if (a.file_name < b.file_name) return -1;
				return 0;
			});

			i++;
			return (
				<Tab.Pane eventKey={x.port_number} key={x.port_number}>
					{
						_.map(filtered_files, (x) => {
							var result = Math.floor(x.status_code / 100)
							if (result == 2) {
								return <div style={{'color': '#5c915c'}} key={x.file_id}>{x.status_code} {x.file_name}</div>
							}
							else {
								return <div key={x.file_id}>{x.status_code}  {x.file_name}</div>
							}
						})
					}
				</Tab.Pane>
			)
		});

		return (
			<Tab.Container id="ports_tab_container"
						   activeKey={this.props.activeTabNumber}
						   onSelect={this.props.tabChange} >
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
