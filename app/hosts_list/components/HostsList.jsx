import _ from 'lodash'
import React from 'react'

import HostsListHead from '../presentational/HostsListHead.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'
import HostsTableTracked from './HostsTableTracked.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'


class HostsList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			regexesObjects: {

			}
		};

		this.filter = this.filter.bind(this);
		this.reworkHostsList = this.reworkHostsList.bind(this);
	}

	filter(data, name) {
		if (data) {
			// Work only on hosts (hostname filter + banner filter)
			var hosts = [];
			var noFilter = true;

			if (this.state.regexesObjects.hasOwnProperty('host')) {
				noFilter = false;

				var hostsRegex = this.state.regexesObjects['host'];
				var newHosts = data['hosts'].filter((x) => {
					return hostsRegex.exec(x['hostname']) !== null;
				});
				hosts = hosts.concat(newHosts);
			}

			if (this.state.regexesObjects.hasOwnProperty('ip')) {
				noFilter = false;

				var ipRegex = this.state.regexesObjects['ip'];
				hosts = hosts.concat(data['hosts'].filter((x) => {
					return x.ip_addresses.filter((y) => {
						return ipRegex.exec(y) !== null
					}).length > 0;
				}));
			}

			// if (this.state.regexesObjects.hasOwnProperty('banner')) {
			// 	noFilter = false;

			// 	var bannerRegex = this.state.regexesObjects['banner'];
			// 	hosts = hosts.concat(data['hosts'].filter((x) => {
			// 		console.log(x);
			// 		return bannerRegex.exec(x['banner']) !== null;
			// 	}));
			// }

			if (noFilter) {
				return {
					'hosts': data['hosts']
				}				
			}
			else {
				return {
					'hosts': hosts
				}
			}
		}
		else {
			return {
				'hosts': []
			}
		}
	}

	componentWillReceiveProps(newProps, newState) {
		const newFilters = newProps['filters'];

		if (newFilters === null) {
			this.setState({
				regexesObjects: {}
			});		
		}
		else {
			var newRegexObjects = {};

			for (var eachKey of Object.keys(newFilters)) {
				newRegexObjects[eachKey] = new RegExp(newFilters[eachKey]);
			}

			this.setState({
				regexesObjects: newRegexObjects
			});			
		}

	}

	reworkHostsList(hosts_input, scans) {
		var hosts = JSON.parse(JSON.stringify(hosts_input));

	    for (var each_host of hosts) {
			for (var ip_index = 0; ip_index < each_host.ip_addresses.length; ip_index++) {
				let ip_address = each_host.ip_addresses[ip_index];
				let filtered_scans = scans.filter((x) => {
					return x.target === ip_address;
				});

				each_host.ip_addresses[ip_index] = {
					'ip_address': ip_address,
					'scans': filtered_scans
				};
			}    	
	    }

	    return hosts
	}

	render() {
		var scopes = this.reworkHostsList(this.props.scopes.hosts, this.props.scans);

		return (
			<div>
				<HostsListHead />
				<Tasks tasks={this.props.tasks} />

				<hr />

				<TasksButtonsTracked scopes={scopes}
									 scans={this.props.scans} 
									 project={this.props.project} />

				<HostsTableTracked project={this.props.project}
								   scopes={scopes}
								   onFilterChange={this.props.onFilterChangeHosts}

								   scans={this.props.scans} />
			</div>
		)
	}
}

export default HostsList;
