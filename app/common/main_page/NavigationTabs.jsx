import _ from 'lodash'
import React from 'react'
import {
    Link
} from 'react-router-dom'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';


import ScopeSetupWrapper from '../../scope_setup/components/ScopeSetupWrapper.js'
import ProjectDetailsWrapper from '../../ips_list/components/ProjectDetailsWrapper.js'
import HostsListWrapper from '../../hosts_list/components/HostsListWrapper.js'
import TasksTabWrapper from '../../tasks_tab/components/TasksTabWrapper.js'

class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.project_uuid = this.props.match.params.project_uuid;

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1'
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}	

	shouldComponentUpdate(nextProps) {
		return (!_.isEqual(nextProps, this.props));
	}
	

	render() {
		return (
			<div>
		        <Nav tabs>
					<NavItem>
						<NavLink className={classnames({ active: this.state.activeTab === '1' })}
								 onClick={() => { this.toggle('1'); }} >
							Scope Setup
						</NavLink>
					</NavItem>
		        </Nav>
				<TabContent activeTab={this.state.activeTab}>
					<TabPane tabId="1">
						<br/>
						<ScopeSetupWrapper project_uuid={this.project_uuid} />
					</TabPane>
				</TabContent>
			</div>


		);
	}
}

			// <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
			// 	<Tab eventKey={1} title="Scope Setup">
			// 		<ScopeSetupWrapper project_uuid={this.project_uuid} />
			// 	</Tab>
			// 	<Tab eventKey={2} title="IPs">
			// 		<ProjectDetailsWrapper project_uuid={this.project_uuid} />
			// 	</Tab>				
			// 	<Tab eventKey={3} title="Hostnames">
			// 		<HostsListWrapper project_uuid={this.project_uuid} />
			// 	</Tab>
			// 	<Tab eventKey={4} title="All Tasks">
			// 		<TasksTabWrapper project_uuid={this.project_uuid} />
			// 	</Tab>				
			// </Tabs>

export default NavigationTabs;
