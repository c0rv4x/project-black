import React from 'react'
import {
    Link
} from 'react-router-dom'
import { 
	Tabs, 
	Tab 
} from 'react-bootstrap'

import ScopeSetupWrapper from '../scope_setup/components/ScopeSetupWrapper.js'
import ProjectDetailsWrapper from '../project_details/components/ProjectDetailsWrapper.js'
import HostsListWrapper from '../hosts_list/components/HostsListWrapper.js'
import TasksTabWrapper from '../tasks_tab/components/TasksTabWrapper.js'

class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.project_name = this.props.match.params.project_name;
	}

	render() {
		return (
			<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
				<Tab eventKey={1} title="Scope Setup">
					<ScopeSetupWrapper project_name={this.project_name} />
				</Tab>
				<Tab eventKey={2} title="IPs">
					<ProjectDetailsWrapper project_name={this.project_name} />
				</Tab>
				<Tab eventKey={3} title="Hostnames">
					<HostsListWrapper project_name={this.project_name} />
				</Tab>
				<Tab eventKey={4} title="All Tasks">
					<TasksTabWrapper project_name={this.project_name} />
				</Tab>				
			</Tabs>
		);
	}
}

export default NavigationTabs;