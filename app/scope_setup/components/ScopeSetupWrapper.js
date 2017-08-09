import _ from 'lodash'
import { connect } from 'react-redux'

import ScopeSetup from './ScopeSetup.jsx'


function mapStateToProps(state, ownProps){
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

    return {
    	project: project,
        scopes: {
        	'ips': _.filter(state.scopes.ips, (x) => {
	        	return x.project_uuid == project['project_uuid']
	        }),
        	'hosts': _.filter(state.scopes.hosts, (x) => {
	        	return x.project_uuid == project['project_uuid']
	        }),	        
        },
        tasks: _.filter(state.tasks.active, (x) => {
        	return x.project_uuid == project['project_uuid']
        })
    }
}


const ScopeSetupWrapper = connect(
	mapStateToProps
)(ScopeSetup)

export default ScopeSetupWrapper;
