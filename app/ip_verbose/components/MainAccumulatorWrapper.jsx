import { connect } from 'react-redux';

import MainAccumulator from './MainAccumulator.jsx';


function mapStateToProps(state, ownProps){
	// Extract project
	let project_uuid = ownProps.match.params.project_uuid;
	let filtered_projects = _.filter(state.projects, (x) => {
		return x.project_uuid == project_uuid
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

	let ip_param = ownProps.match.params.ip_address;
	var ip_object = null
	let ip_objects = _.filter(state.scopes.ips, (x) => {
    	return ((x.project_uuid == project['project_uuid']) && (x.ip_address == ip_param))
    });

    if (ip_objects.length > 0) {
    	ip_object = ip_objects[0];
    }

	ip_object = ip_object || { "ip_address": null, "comment": "" };


    // Ports filter
    let ports_filtered = _.filter(state.scans, (x) => {
    	return ((x.project_uuid == project['project_uuid']) && (ip_object.ip_address == x.target))
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

    // Get files
    let files = [];
    if (ip_object.ip_address) {
		files = state.files[ip_object.ip_address];
    }

    return {
    	project: project,
    	ip: ip_object,
        ports: ports_sorted,
        // tasks: _.filter(state.tasks.active, (x) => {
        // 	return x.project_uuid == project['project_uuid']
        // })
        files: files
    }
}


const MainAccumulatorWrapper = connect(
	mapStateToProps
)(MainAccumulator)

export default MainAccumulatorWrapper
