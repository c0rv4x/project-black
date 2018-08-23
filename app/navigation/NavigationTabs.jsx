import _ from 'lodash'
import React from 'react'
import {
    Link
} from 'react-router-dom'
import classnames from 'classnames';
import { Tab, Menu, Icon } from 'semantic-ui-react'

import ScopeSetupWrapper from '../scope_setup/components/ScopeSetupWrapper.js'
import ProjectDetailsWrapper from '../ips_list/components/ProjectDetailsWrapper.js'
import HostsListWrapper from '../hosts_list/components/HostsListWrapper.js'
import TasksTabWrapper from '../tasks_tab/components/TasksTabWrapper.js'
import SettingsWrapper from '../settings/components/SettingsWrapper.js'


class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex : 1
		}

		this.project_uuid = this.props.match.params.project_uuid;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}
	
	render() {
		const dirsearch_link = '/project/' + this.project_uuid + '/dirsearch';

		const panes = [
			{
				menuItem: <Menu.Item key="main" as={Link} to='/' >
					<Icon name="home"></Icon>
				</Menu.Item>
			},		
			{
				menuItem: 'Scope Setup',
				render: (() => <ScopeSetupWrapper project_uuid={this.project_uuid} />)
			},
			{
				menuItem: 'IP List',
				render: (() => <ProjectDetailsWrapper project_uuid={this.project_uuid} />)
			},
			{
				menuItem: 'Hosts List',
				render: (() => <HostsListWrapper project_uuid={this.project_uuid} />)
			},
			{
				menuItem: <Menu.Item key="dirsearch_table" onClick={() => 
					window.open(dirsearch_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
					Dirsearch List
				</Menu.Item>
			},
			{
				menuItem: 'Settings',
				render: (() => <SettingsWrapper project_uuid={this.project_uuid} />)
			},
		]

		const { activeIndex } = this.state;

		return (
			<Tab onTabChange={
					 (event, data) => {
					 	 var activeIndex = data.activeIndex;
						 if ((activeIndex !== 4) && (activeIndex !== 0)) {
							 this.setState({
								 activeIndex: activeIndex
							 })
						 }
					 }
				 }
				 activeIndex={activeIndex}
				 panes={panes}
			/>
		)
	}
}

			// 	<Tab eventKey={4} title="All Tasks">
			// 		<TasksTabWrapper project_uuid={this.project_uuid} />
			// 	</Tab>				

export default NavigationTabs;
