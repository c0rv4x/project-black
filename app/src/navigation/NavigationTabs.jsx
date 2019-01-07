import _ from 'lodash'
import React from 'react'
import {
    Link
} from 'react-router-dom'
// import { Tab, Menu, Icon } from 'semantic-ui-react'

import {
	Box,
	Tabs,
	Tab,
	Text
} from 'grommet'
import { Home } from 'grommet-icons';

import ScopeSetupWrapper from '../scope_setup/components/ScopeSetupWrapper.js'
import IPsListWrapper from '../ips_list/components/IPsListWrapper.js'
import HostsListWrapper from '../hosts_list/components/HostsListWrapper.js'


// import Perf from 'react-addons-perf'

const RichTabTitle = ({ icon, label }) => (
	<Box direction="row" align="center" gap="xsmall" margin="xsmall">
		{icon}
		<Text size="small">
			<strong>{label}</strong>
		</Text>
	</Box>
);


class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex : 1
		}

		this.project_uuid = this.props.match.params.project_uuid;

	}

	// componentDidMount() {
	// 	setTimeout(() => {
	// 	  Perf.start();
	// 	  setTimeout(() => {
	// 		Perf.stop();
	// 		const measurements = Perf.getLastMeasurements();
	// 		Perf.printInclusive(measurements);
	// 	  }, 30000);
	// 	}, 5000);
	//   }

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}
	
	render() {
		const dirsearch_link = '/project/' + this.project_uuid + '/dirsearch';

		// const panes = [
		// 	{
		// 		menuItem: <Menu.Item key="main" as={Link} to='/' >
		// 			<Icon name="home"></Icon>
		// 		</Menu.Item>
		// 	},		
		// 	{
		// 		menuItem: 'Scope Setup',
		// 		render: (() => <ScopeSetupWrapper project_uuid={this.project_uuid} />)
		// 	},
		// 	{
		// 		menuItem: 'IP List',
		// 		render: (() => <IPsListWrapper project_uuid={this.project_uuid} />)
		// 	},
		// 	{
		// 		menuItem: 'Hosts List',
		// 		render: (() => <HostsListWrapper project_uuid={this.project_uuid} />)
		// 	},
		// 	{
		// 		menuItem: <Menu.Item key="dirsearch_table" onClick={() => 
		// 			window.open(dirsearch_link, Math.random().toString(36).substring(7), 'width=850,height=700')}>
		// 			Dirsearch List
		// 		</Menu.Item>
		// 	}
		// ]

		const { activeIndex } = this.state;

		return (
			// <Tab onTabChange={
			// 		 (event, data) => {
			// 		 	 var activeIndex = data.activeIndex;
			// 			 if ((activeIndex !== 4) && (activeIndex !== 0)) {
			// 				 this.setState({
			// 					 activeIndex: activeIndex
			// 				 })
			// 			 }
			// 		 }
			// 	 }
			// 	 activeIndex={activeIndex}
			// 	 panes={panes}
			// />
			<Tabs
				activeIndex={activeIndex}
				onActive={(index) => {this.setState({activeIndex: index})}}
			>
				<Tab
					title="Home"
				>
					<Box
						margin="small"
						align="center"
					>
						Home
					</Box>
				</Tab>
				<Tab
					title="Overview"
				>
					<Box
						margin="small"
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
						IP addresses
					</Box>
				</Tab>
				<Tab
					title="Hosts"
				>
					<Box
						margin="small"
						align="stretch"
					>
						Hosts list
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
