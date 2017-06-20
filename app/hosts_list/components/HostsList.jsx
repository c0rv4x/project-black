import _ from 'lodash'
import React from 'react'

import HostsListHead from '../presentational/HostsListHead.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'
import HostsTableTracked from './HostsTableTracked.jsx'


class HostsList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			regexesObjects: {

			}
		};

		this.filter = this.filter.bind(this);
	}

	filter(data, name) {
		if (data) {
			// var filtered = {
			// 	'ips': data['ips'],
			// 	'hosts': []
			// };

			// for (var eachValue of data['hosts']) {
			// 	console.log(eachValue);
			// }
			var hosts = null;

			if (this.state.regexesObjects.hasOwnProperty('host')) {
				var hostsRegex = this.state.regexesObjects['host'];
				hosts = data['hosts'].filter((x) => {
					return hostsRegex.exec(x['hostname']) !== null;
				});
			}
			else {
				hosts = data['hosts']
			}

			return {
				'ips': data['ips'],
				'hosts': hosts
			}
		}
		else {
			return {
				'ips': [] ,
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

	render() {
		// var scopes = this.filter(this.props.scopes, 'host');
		var scopes = this.props.scopes;

		return (
			<div>
				<HostsListHead />
				<Tasks tasks={this.props.tasks} />

				<hr />

				<HostsTableTracked project={this.props.project}
								   scopes={scopes}
								   onFilterChange={this.props.onFilterChangeHosts}

								   scans={this.props.scans} />
			</div>
		)
	}
}

export default HostsList;
