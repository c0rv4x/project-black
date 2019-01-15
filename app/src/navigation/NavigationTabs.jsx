import _ from 'lodash'
import React from 'react'
import {
    Redirect
} from 'react-router-dom'

import {
	Anchor,
	Box,
	Tabs,
	Tab
} from 'grommet'

import ScopeSetupWrapper from '../scope_setup/components/ScopeSetupWrapper.js'
import IPsListWrapper from '../ips_list/components/IPsListWrapper.js'
import HostsListWrapper from '../hosts_list/components/HostsListWrapper.js'
import DirsearchWrapper from './DirsearchWrapper.jsx'


class NavigationTabs extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeIndex : 3
		}

		this.project_uuid = this.props.match.params.project_uuid;
		this.tabChange = this.tabChange.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}

	tabChange(index) {
		if (index != 4) {
			this.setState({activeIndex: index});
		}
		else {
			const dirsearch_link = '/project/' + this.project_uuid + '/dirsearch';
			window.open(dirsearch_link, Math.random().toString(36).substring(7), 'width=850,height=700');
		}
	}
	
	render() {
		const { activeIndex } = this.state;

		return (
			<Tabs
				activeIndex={activeIndex}
				onActive={this.tabChange}
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
				<Tab
					title="Dirsearch list"
				>
				</Tab>
			</Tabs>
		)
	}
}

export default NavigationTabs;
