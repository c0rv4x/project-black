import _ from 'lodash'
import React from 'react'
import {
    Redirect
} from 'react-router-dom'

import {
	Box,
	Tabs,
	Tab
} from 'grommet'

import ScopeSetupWrapper from '../scope_setup/components/ScopeSetupWrapper.js'
import IPsListWrapper from '../ips_list/components/IPsListWrapper.js'
import HostsListWrapper from '../hosts_list/components/HostsListWrapper.js'


class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex : 3
		}

		this.project_uuid = this.props.match.params.project_uuid;

	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}
	
	render() {
		const dirsearch_link = '/project/' + this.project_uuid + '/dirsearch';

		// 	{
		// 		menuItem: <Menu.Item key="dirsearch_table" onClick={() => 
		// 			window.open(dirsearch_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
		// 			Dirsearch List
		// 		</Menu.Item>
		// 	}
		// ]

		const { activeIndex } = this.state;

		return (
			<Tabs
				activeIndex={activeIndex}
				onActive={(index) => {this.setState({activeIndex: index})}}
			>
				<Tab
					title="Home"
				>
					<Redirect to="/" push />
				</Tab>
				<Tab
					title="Overview"
				>
					<Box
						margin="large"
						align="stretch"
					>
						<ScopeSetupWrapper project_uuid={this.project_uuid} />
					</Box>
				</Tab>
				<Tab
					title="IPs"
				>
					<Box
						margin="small"
						align="stretch"
					>
						<IPsListWrapper project_uuid={this.project_uuid} />
					</Box>
				</Tab>
				<Tab
					title="Hosts"
				>
					<Box
						margin="small"
						align="stretch"
					>
						<HostsListWrapper project_uuid={this.project_uuid} />
					</Box>
				</Tab>
				
			</Tabs>
		)
	}
}

			// 	<Tab eventKey={4} title="All Tasks">
			// 		<TasksTabWrapper project_uuid={this.project_uuid} />
			// 	</Tab>				

export default NavigationTabs;
