import _ from 'lodash'
import React from 'react'
import {
    Link
} from 'react-router-dom'
import { 
	Tabs, 
	Tab 
} from 'react-bootstrap'

import ScopeSetupWrapper from '../../scope_setup/components/ScopeSetupWrapper.js'
import ProjectDetailsWrapper from '../../ips_list/components/ProjectDetailsWrapper.js'
import HostsListWrapper from '../../hosts_list/components/HostsListWrapper.js'
import TasksTabWrapper from '../../tasks_tab/components/TasksTabWrapper.js'

class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.project_uuid = this.props.match.params.project_uuid;

	}

	shouldComponentUpdate(nextProps) {
		return (!_.isEqual(nextProps, this.props));
	}

componentWillMount() {
  setTimeout(() => {
    window.Perf.start();
    setTimeout(() => {
      window.Perf.stop();
      window.measurements = window.Perf.getLastMeasurements();
      window.Perf.printWasted(window.measurements);
      window.Perf.printInclusive(window.measurements);
      window.Perf.printExclusive(window.measurements);
    }, 30000);
  }, 5000);
}		

	render() {
		return (
			<Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
				<Tab eventKey={1} title="Scope Setup">
					<ScopeSetupWrapper project_uuid={this.project_uuid} />
				</Tab>
				<Tab eventKey={2} title="IPs">
					<ProjectDetailsWrapper project_uuid={this.project_uuid} />
				</Tab>
				<Tab eventKey={3} title="Hostnames">
					<HostsListWrapper project_uuid={this.project_uuid} />
				</Tab>
				<Tab eventKey={4} title="All Tasks">
					<TasksTabWrapper project_uuid={this.project_uuid} />
				</Tab>				
			</Tabs>
		);
	}
}

export default NavigationTabs;
