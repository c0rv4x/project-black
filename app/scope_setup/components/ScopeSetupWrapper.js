import _ from 'lodash'
import { connect } from 'react-redux'

import ScopeSetupUpdater from './ScopeSetupUpdater.jsx'


function mapStateToProps(state, ownProps) {
	let project_uuid = ownProps.project_uuid;
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

	console.log(state);

    return {
    	project: project,
    	ips: state.ips,
    	hosts: state.hosts,
        tasks: _.filter(state.tasks.active, (x) => {
        	return x.project_uuid == project['project_uuid']
        }),
        scans: state.scans
    }
}


const ScopeSetupWrapper = connect(
	mapStateToProps
)(ScopeSetupUpdater)

export default ScopeSetupWrapper;
