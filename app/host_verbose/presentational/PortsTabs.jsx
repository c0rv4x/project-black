import React from 'react'
import { Tab, Col, Row, Nav, NavItem } from 'react-bootstrap'


class PortsTabs extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Tab.Container id="ports_tab_container" defaultActiveKey={1}>
				<Row className="clearfix">
					<Col md={2} sm={2}>
						<Nav bsStyle="pills" stacked>
						<NavItem eventKey={1}>
							Tab 1
						</NavItem>
						<NavItem eventKey={2}>
							Tab 2
						</NavItem>
						</Nav>
					</Col>
					<Col md={10} sm={10}>
						<Tab.Content animation>
							<Tab.Pane eventKey={1}>
								Tab 1 content
							</Tab.Pane>
							<Tab.Pane eventKey={2}>
								Tab 2 content
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
		)
	}
}

export default PortsTabs;
