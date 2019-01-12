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

	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}
	
	render() {
		const dirsearch_link = '/project/' + this.project_uuid + '/dirsearch';
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
				<Tab
					title="Dirsearch list"
				>
					<Box
						margin="small"
						align="stretch"
					>
						<Redirect to={dirsearch_link} push />
					</Box>
				</Tab>
			</Tabs>
		)
	}
}

export default NavigationTabs;
