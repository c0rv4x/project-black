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
		const panes = [
		{
			menuItem: 'Scope Setup',
			render: (() => <ScopeSetupWrapper project_uuid={this.project_uuid} />)
		},
		{
			menuItem: 'IP List',
			render: (() => <ProjectDetailsWrapper project_uuid={this.project_uuid} />)
		}	
		]

		return (
			<Tab panes={panes}/>
		)
	}
}

			// 	<Tab eventKey={4} title="All Tasks">
			// 		<TasksTabWrapper project_uuid={this.project_uuid} />
			// 	</Tab>				

export default NavigationTabs;
