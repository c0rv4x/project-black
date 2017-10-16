import _ from 'lodash'
import React from 'react'
import {
    Link
} from 'react-router-dom'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { Tab } from 'semantic-ui-react'

import ScopeSetupWrapper from '../../scope_setup/components/ScopeSetupWrapper.js'
import ProjectDetailsWrapper from '../../ips_list/components/ProjectDetailsWrapper.js'
import HostsListWrapper from '../../hosts_list/components/HostsListWrapper.js'
import TasksTabWrapper from '../../tasks_tab/components/TasksTabWrapper.js'

class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.project_uuid = this.props.match.params.project_uuid;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(nextProps, this.props);
	}
	
	render() {
		const panes = [{
			menuItem: 'Scope Setup',
			render: (() => <ScopeSetupWrapper project_uuid={this.project_uuid} />)
		}]

		return (
			<Tab panes={panes}/>
		)
	}

	// render() {
	// 	return (
	// 		<div>
	// 	        <Nav tabs>
	// 				<NavItem>
	// 					<NavLink className={classnames({ active: this.state.activeTab === '1' })}
	// 							 onClick={() => { this.toggle('1'); }} >
	// 						Scope Setup
	// 					</NavLink>
	// 				</NavItem>
	// 				<NavItem>
	// 					<NavLink className={classnames({ active: this.state.activeTab === '2' })}
	// 							 onClick={() => { this.toggle('2'); }} >
	// 						IPs
	// 					</NavLink>
	// 				</NavItem>
	// 				<NavItem>
	// 					<NavLink className={classnames({ active: this.state.activeTab === '3' })}
	// 							 onClick={() => { this.toggle('3'); }} >
	// 						Hosts
	// 					</NavLink>
	// 				</NavItem>					
	// 	        </Nav>
	// 			<TabContent activeTab={this.state.activeTab}>
	// 				<TabPane tabId="1">
	// 					<br/>
	// 					<ScopeSetupWrapper project_uuid={this.project_uuid} />
	// 				</TabPane>
	// 				<TabPane tabId="2">
	// 					<br/>
	// 					<ProjectDetailsWrapper project_uuid={this.project_uuid} />
	// 				</TabPane>
	// 				<TabPane tabId="3">
	// 					<br/>
	// 					<HostsListWrapper project_uuid={this.project_uuid}/>
	// 				</TabPane>
	// 			</TabContent>
	// 		</div>


	// 	);
	// }
}

			// 	<Tab eventKey={4} title="All Tasks">
			// 		<TasksTabWrapper project_uuid={this.project_uuid} />
			// 	</Tab>				

export default NavigationTabs;
