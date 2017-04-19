import { connect } from 'react-redux';

import MainAccumulator from './MainAccumulator.jsx';


function mapStateToProps(state, ownProps){
	// Extract project
	let project_name = ownProps.match.params.project_name;
	let filtered_projects = _.filter(state.projects, (x) => {
		return x.project_name == project_name
	});

	let project = null;

	if (filtered_projects.length) {
		project = filtered_projects[0]
	} else {
		project = {
			"project_name": null,
			"project_uuid": null,
			"comment": ""
		}
	}

	// Extract hostname
	let hostname = ownProps.match.params.hostname;
	let filtered_hosts = _.filter(state.scopes['hosts'], (x) => {
		return ((x.hostname == hostname) && (x.project_uuid == project['project_uuid']));
	});

	let host = null;

	if (filtered_hosts.length) {
		host = filtered_hosts[0]
	} else {
		host = {
			"hostname": null,
			"_id": null,
			"comment": ""
		}
	}

	// Filter only related IPs
	let filtered_ips = _.filter(state.scopes.ips, (x) => {
    	return ((x.project_uuid == project['project_uuid']) && (x.hostnames.indexOf(host['hostname']) !== -1))
    });

	// TODO make proper ip choser
    let ip = null;

    if (filtered_ips.length) {
    	ip = filtered_ips[0];
    }

    // Ports filter
    let ports_filtered = _.filter(state.scans, (x) => {
    	return ((x.project_uuid == project['project_uuid']) && (ip.ip_address == x.target))
    });

    let ports_sorted = ports_filtered.sort((a, b) => {
    	if (a['port_number'] < b['port_number']) {
    		return -1;
    	}
    	if (a['port_number'] > b['port_number']) {
    		return 1;
    	}
    	if (a['port_number'] == b['port_number']) {
    		return 0;
    	}    	
    });

    return {
    	project: project,
    	host: host,
    	ip: ip,
        ports: ports_sorted,
        tasks: _.filter(state.tasks.active, (x) => {
        	return x.project_uuid == project['project_uuid']
        })
    }
}


const MainAccumulatorWrapper = connect(
	mapStateToProps
)(MainAccumulator)

export default MainAccumulatorWrapper
