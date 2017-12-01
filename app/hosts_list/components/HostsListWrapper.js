import _ from 'lodash'
import { connect } from 'react-redux'

import HostsListFilters from './HostsListFilters.jsx'
import { updateComment as updateProjectComment } from '../../redux/projects/actions'
import { updateComment as updateScopeComment } from '../../redux/scopes/actions'
import { updateFilters } from '../../redux/filters/actions'


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

    return {
    	project_uuid: project.project_uuid,
    	hosts: state.hosts,
        tasks: state.tasks.active,
        scans: state.scans
    }
}


const HostsListWrapper = connect(
	mapStateToProps
)(HostsListFilters)

export default HostsListWrapper
