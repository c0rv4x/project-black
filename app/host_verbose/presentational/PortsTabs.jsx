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
				<NavItem eventKey={i} key={i}>
					{x.port_number}
				</NavItem>
			);
		});

		i = 0;
		const tabPanes = _.map(this.props.ports, (x) => {
			i++;
			return (
				<Tab.Pane eventKey={i} key={i}>
					{x.scan_id}
				</Tab.Pane>
			)
		});

		return (
			<Tab.Container id="ports_tab_container" defaultActiveKey={1}>
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
