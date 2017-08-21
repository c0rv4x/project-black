import _ from 'lodash'
import React from 'react'

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
import ProjectCommentTracked from '../../common/project_comment/ProjectComment.jsx'
import IPTableTracked from './IPTableTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'

class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			regexesObjects: {

			}
		};

		this.filter = this.filter.bind(this);
		this.reworkIPsList = this.reworkIPsList.bind(this);
	}

	filter(data, name) {
		if (data) {
			// Work only on ips (hostname filter + banner filter)
			var data_copy = JSON.parse(JSON.stringify(data));
			var ips = [];
			var noFilter = true;

			// if (this.state.regexesObjects.hasOwnProperty('host')) {
			// 	noFilter = false;

			// 	var ipsRegex = this.state.regexesObjects['host'];
			// 	var newIPs = data_copy.filter((x) => {
			// 		return ipsRegex.test(x['hostname']) !== null;
			// 	});

			// 	ips = ips.concat(newIPs);
			// }

			if (this.state.regexesObjects.hasOwnProperty('ip')) {
				noFilter = false;

				var ipRegex = this.state.regexesObjects['ip'];
				ips = ips.concat(data_copy.filter((x) => {
					return ipRegex.test(x.ip_address);
				}));
			}

			if (this.state.regexesObjects.hasOwnProperty('banner')) {
				if (noFilter) {
					ips = data_copy;
				}

				noFilter = false;
				var bannerRegex = this.state.regexesObjects['banner'];
				for (var ip_address of ips) {
					ip_address['scans'] = ip_address['scans'].filter((x) => {
						return bannerRegex.test(x['banner']);
					});
				}
				ips = ips.filter((x) => {
					return x['scans'].length > 0;
				});
			}

			if (this.state.regexesObjects.hasOwnProperty('port')) {
				if (noFilter) {
					ips = data_copy;
				}

				noFilter = false;
				var portRegex = this.state.regexesObjects['port'];
				for (var ip_address of ips) {
					ip_address['scans'] = ip_address['scans'].filter((x) => {
						return portRegex.test(String(x['port_number']));
					});
				}

				ips = ips.filter((x) => {
					return x.scans.length > 0;
				});
			}

			if (noFilter) {
				return data_copy
			}
			else {
				return ips
			}
		}
		else {
			return []
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

	reworkIPsList(ips_input, scans) {
		var ips = JSON.parse(JSON.stringify(ips_input));

	    for (var each_ip of ips) {
	    	each_ip['scans'] = scans.filter((x) => {
	    		return x.target == each_ip.ip_address;
	    	});
	    }

	    return ips
	}

  	shouldComponentUpdate(nextProps) {
  		return (!_.isEqual(nextProps, this.props))
  	}

	render() {
		const scopes = this.reworkIPsList(this.props.scopes.ips, this.props.scans);
		const filtered_scopes = this.filter(scopes);

		return (
			<div>
				<h4>Working with ips (usually, network level utilities are run here)</h4>
				<hr/>

				<h3>{this.props.project.project_name}</h3>
				<Tasks tasks={this.props.tasks} />
				<ProjectCommentTracked project={this.props.project} />

				<TitleButtonsWithHandlers scopes={filtered_scopes}
									      project={this.props.project} 
									      scans={this.props.scans} />				
				<IPTableTracked scopes={filtered_scopes}
								scans={this.props.scans}
								onFilterChange={this.props.onFilterChangeIPs} />
			</div>
		)
	}
}

export default ProjectDetails;
